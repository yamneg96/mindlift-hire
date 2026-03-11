import path from "node:path";
import type { Request, Response } from "express";

import { ApplicationModel } from "../models/Application.js";
import { RoleModel } from "../models/Role.js";
import { applySchema } from "../zod/application.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { uploadToCloudStorage } from "../config/cloudStorage.js";
import { sendApplicantNotificationEmail } from "../services/email/emailService.js";

function isRoleApplicationEnabled() {
  return (
    String(process.env.ROLE_APPLICATIONS_ENABLED ?? "true").toLowerCase() ===
    "true"
  );
}

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
  if (!isRoleApplicationEnabled()) {
    return sendError(
      res,
      "Role applications are currently disabled. Please check again later.",
      503,
    );
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
    applicantEmail: body.email.toLowerCase(),
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
    applicationType: body.applicationType ?? "role",
    applicantName: body.fullName,
    applicantEmail: body.email.toLowerCase(),
    phone: body.phone ?? "",
    linkedin: body.linkedin ?? "",
    portfolio: body.portfolio ?? "",
    skills: body.skills ?? [],
    experienceLevel: body.experienceLevel ?? "",
    availability: body.availability ?? "",
    roleId: body.roleId,
    cvUrl,
    portfolioUrl,
    motivationLetter: body.motivationLetter ?? "",
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

  const roleTitle =
    (role as { title?: string }).title ?? "the selected position";

  await sendApplicantNotificationEmail({
    to: body.email.toLowerCase(),
    subject: "We received your MindLift application",
    title: "Application Received",
    subtitle: "Thank you for applying to MindLift",
    roleTitle,
    message:
      "We have received your application and our team will contact you after the initial filtering process is completed.",
  }).catch(() => {
    // no-op: application submission should succeed even if email delivery fails
  });

  return sendSuccess(res, application, "Application submitted", 201);
}

export async function getApplicationById(req: Request, res: Response) {
  const application = await ApplicationModel.findById(req.params.id).populate(
    "roleId",
    "title department status",
  );

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  return sendSuccess(res, application.toObject());
}
