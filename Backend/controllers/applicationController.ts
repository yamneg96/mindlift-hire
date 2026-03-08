import path from "node:path";
import type { Request, Response } from "express";

import { ApplicationModel } from "../models/Application.js";
import { RoleModel } from "../models/Role.js";
import { applySchema } from "../zod/application.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { uploadToCloudStorage } from "../config/cloudStorage.js";

function buildPublicFileUrl(filePath: string) {
  const normalized = filePath.replace(/\\/g, "/");
  const base = process.env.UPLOAD_BASE_URL ?? "";
  if (normalized.startsWith("/uploads")) {
    return `${base}${normalized}`;
  }

  const uploadsIndex = normalized.indexOf("uploads/");
  if (uploadsIndex >= 0) {
    return `${base}/${normalized.slice(uploadsIndex)}`;
  }

  return `${base}/${path.basename(normalized)}`;
}

export async function applyForRole(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const body = parseBody<ReturnType<typeof applySchema.parse>>(
    applySchema,
    req.body,
  );

  const cvFile = (
    req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
  )?.cv?.[0];
  const portfolioFile = (
    req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
  )?.portfolio?.[0];

  if (!cvFile) {
    return sendError(res, "CV file is required", 400);
  }

  const role = await RoleModel.findById(body.roleId).select("status");
  if (!role || role.status !== "open") {
    return sendError(res, "Role not available", 404);
  }

  const existing = await ApplicationModel.findOne({
    userId: req.user.id,
    roleId: body.roleId,
  }).lean();

  if (existing) {
    return sendError(res, "Duplicate application for this role", 409);
  }

  const useCloud =
    String(process.env.USE_CLOUD_STORAGE).toLowerCase() === "true";
  const cvUrl = useCloud
    ? await uploadToCloudStorage(cvFile.path, "cv")
    : buildPublicFileUrl(cvFile.path);

  let portfolioUrl = "";
  if (portfolioFile) {
    portfolioUrl = useCloud
      ? await uploadToCloudStorage(portfolioFile.path, "portfolio")
      : buildPublicFileUrl(portfolioFile.path);
  }

  const application = await ApplicationModel.create({
    userId: req.user.id,
    roleId: body.roleId,
    cvUrl,
    portfolioUrl,
    motivationLetter: body.motivationLetter,
    additionalAnswers: {
      experienceLevel: body.experienceLevel,
      availability: body.availability,
      expectedContribution: body.expectedContribution ?? "",
    },
    status: "pending",
    appliedAt: new Date(),
  });

  // eslint-disable-next-line no-console
  console.log(`[application] submitted: ${application._id}`);

  return sendSuccess(res, application, "Application submitted", 201);
}

export async function listMyApplications(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const applications = await ApplicationModel.find({ userId: req.user.id })
    .populate("roleId", "title department status")
    .sort({ appliedAt: -1 })
    .lean();

  return sendSuccess(res, applications);
}

export async function getApplicationById(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const application = await ApplicationModel.findById(req.params.id)
    .populate("roleId", "title department status")
    .populate("userId", "name email profile");

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  const appUser = application.userId as { _id?: unknown } | unknown;
  const ownerId =
    typeof appUser === "object" && appUser !== null && "_id" in appUser
      ? String((appUser as { _id: unknown })._id)
      : String(appUser);
  const isOwner = ownerId === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return sendError(res, "Forbidden", 403);
  }

  return sendSuccess(res, application.toObject());
}
