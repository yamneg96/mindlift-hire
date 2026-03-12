import type { Request, Response } from "express";
import mongoose from "mongoose";

import { AdminNoteModel } from "../models/AdminNote.js";
import { ApplicationModel } from "../models/Application.js";
import { RoleModel } from "../models/Role.js";
import {
  adminFilterSchema,
  updateApplicationDecisionSchema,
} from "../zod/application.js";
import { parseBody, parseQuery } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";

function csvEscape(value: unknown) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `\"${str.replace(/\"/g, '\"\"')}\"`;
  }

  return str;
}

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }

  return lines.join("\n");
}

export async function listApplicationsForAdmin(req: Request, res: Response) {
  const query = parseQuery<ReturnType<typeof adminFilterSchema.parse>>(
    adminFilterSchema,
    req.query,
  );

  const roleFilter = query.role
    ? await RoleModel.find({ title: new RegExp(query.role, "i") }, "_id").lean()
    : [];

  const dbQuery: Record<string, unknown> = {};

  if (query.status) {
    dbQuery.status = query.status;
  }

  if (query.role) {
    dbQuery.roleId = { $in: roleFilter.map((r) => r._id) };
  }

  if (query.dateFrom || query.dateTo) {
    dbQuery.appliedAt = {
      ...(query.dateFrom ? { $gte: new Date(query.dateFrom) } : {}),
      ...(query.dateTo ? { $lte: new Date(query.dateTo) } : {}),
    };
  }

  const skip = (query.page - 1) * query.limit;

  let applications = await ApplicationModel.find(dbQuery)
    .populate("roleId", "title department")
    .populate("secondRoleId", "title department")
    .populate("thirdRoleId", "title department")
    .sort({ appliedAt: -1 })
    .skip(skip)
    .limit(query.limit)
    .lean();

  if (query.skill) {
    const skillRegex = new RegExp(query.skill, "i");
    applications = applications.filter((app) => {
      const skills = (app.skills ?? []) as string[];
      return skills.some((skill: string) => skillRegex.test(skill));
    });
  }

  if (query.export === "csv") {
    const csvRows = applications.map((app) => ({
      applicantName: app.applicantName,
      applicantEmail: app.applicantEmail,
      role: (app.roleId as { title?: string })?.title,
      cvUrl: app.cvUrl,
      status: app.status,
      appliedAt: app.appliedAt,
    }));

    const csv = toCsv(csvRows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.csv",
    );
    return res.status(200).send(csv);
  }

  const total = await ApplicationModel.countDocuments(dbQuery);

  return sendSuccess(res, {
    items: applications,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  });
}

export async function updateApplicationByAdmin(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const body = parseBody<
    ReturnType<typeof updateApplicationDecisionSchema.parse>
  >(updateApplicationDecisionSchema, req.body);

  const application = await ApplicationModel.findById(req.params.id);
  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  application.status = body.status;
  application.adminNotes = body.adminNotes ?? application.adminNotes;
  application.pipelineStage = body.pipelineStage ?? application.pipelineStage;
  application.reviewedAt = new Date();

  await application.save();

  if (body.adminNotes?.trim()) {
    const actorId = req.user.id;
    const hasObjectIdAdmin = mongoose.Types.ObjectId.isValid(actorId);

    await AdminNoteModel.create({
      applicationId: application._id,
      ...(hasObjectIdAdmin ? { adminId: actorId } : {}),
      adminEmail: req.user.email,
      note: body.adminNotes,
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `[admin] decision ${body.status} for application ${application._id}`,
  );

  return sendSuccess(res, application, "Application updated");
}

export async function deleteApplicationByAdmin(req: Request, res: Response) {
  const application = await ApplicationModel.findByIdAndDelete(req.params.id);
  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  await AdminNoteModel.deleteMany({ applicationId: application._id });

  return sendSuccess(res, { id: req.params.id }, "Application deleted");
}

export async function getAdminStats(_req: Request, res: Response) {
  const [
    distinctApplicants,
    totalApplications,
    pendingApplications,
    approvedApplications,
    applicationsPerRole,
  ] = await Promise.all([
    ApplicationModel.distinct("applicantEmail"),
    ApplicationModel.countDocuments(),
    ApplicationModel.countDocuments({ status: "pending" }),
    ApplicationModel.countDocuments({ status: "approved" }),
    ApplicationModel.aggregate([
      {
        $match: {
          roleId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$roleId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "_id",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: "$role" },
      {
        $project: {
          _id: 0,
          roleId: "$role._id",
          roleTitle: "$role.title",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  return sendSuccess(res, {
    totalUsers: distinctApplicants.length,
    totalApplications,
    pendingApplications,
    approvedApplications,
    applicationsPerRole,
  });
}

export async function listUsersForAdmin(_req: Request, res: Response) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .map((email, index) => ({
      id: `admin-${index + 1}`,
      name: "Admin",
      email,
      role: "admin",
    }));

  return sendSuccess(res, admins);
}
