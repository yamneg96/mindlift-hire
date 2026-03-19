import type { Request, Response } from "express";

import { ApplicationModel } from "../models/Application.js";
import { RoleModel } from "../models/Role.js";
import { applySchema } from "../zod/application.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import {
  isCloudStorageEnabled,
  uploadBufferToCloudStorageWithMetadata,
} from "../config/cloudStorage.js";
import { sendApplicantNotificationEmail } from "../services/email/emailService.js";

function isRoleApplicationEnabled() {
  return (
    String(process.env.ROLE_APPLICATIONS_ENABLED ?? "true").toLowerCase() ===
    "true"
  );
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

  if (!isCloudStorageEnabled()) {
    return sendError(res, "CV upload failed", 503, "Cloud storage is disabled");
  }

  const selectedRoleIds = [body.roleId, body.secondRoleId, body.thirdRoleId]
    .filter(Boolean)
    .map(String);

  if (new Set(selectedRoleIds).size !== selectedRoleIds.length) {
    return sendError(res, "Role choices must be unique", 400);
  }

  const foundRoles = await RoleModel.find({ _id: { $in: selectedRoleIds } })
    .select("_id status title")
    .lean();

  const roleMap = new Map(foundRoles.map((item) => [String(item._id), item]));
  for (const selectedRoleId of selectedRoleIds) {
    const selectedRole = roleMap.get(selectedRoleId);
    if (!selectedRole || selectedRole.status !== "open") {
      return sendError(
        res,
        "One or more selected roles are not available",
        404,
      );
    }
  }

  const primaryRole = roleMap.get(String(body.roleId));
  const role: { _id: string; title?: string; status?: string } | null =
    primaryRole
      ? {
          _id: String(primaryRole._id),
          status: primaryRole.status,
          title: primaryRole.title,
        }
      : null;

  const cvFileExtension = cvFile.originalname.includes(".")
    ? cvFile.originalname.slice(cvFile.originalname.lastIndexOf("."))
    : ".pdf";

  // eslint-disable-next-line no-console
  console.info(
    `[application] CV upload started for ${body.email.toLowerCase()} (${cvFile.originalname}, ${cvFile.size} bytes)`,
  );

  let cvUpload: { secureUrl: string; publicId: string };
  try {
    cvUpload = await uploadBufferToCloudStorageWithMetadata({
      file: cvFile.buffer,
      fileName: `cv_${Date.now()}${cvFileExtension}`,
      folder: "mindlift/cv",
      resourceType: "raw",
    });
    // eslint-disable-next-line no-console
    console.info(
      `[application] CV upload completed: public_id=${cvUpload.publicId}`,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[application] CV upload failed", error);
    return sendError(res, "CV upload failed", 500);
  }

  let portfolioUrl = "";
  if (portfolioFile) {
    // eslint-disable-next-line no-console
    console.info(
      `[application] Portfolio upload started for ${body.email.toLowerCase()} (${portfolioFile.originalname}, ${portfolioFile.size} bytes)`,
    );
    try {
      const portfolioUpload = await uploadBufferToCloudStorageWithMetadata({
        file: portfolioFile.buffer,
        fileName: `portfolio_${Date.now()}_${portfolioFile.originalname}`,
        folder: "mindlift/portfolio",
        resourceType: "raw",
      });
      portfolioUrl = portfolioUpload.secureUrl;
      // eslint-disable-next-line no-console
      console.info(
        `[application] Portfolio upload completed: public_id=${portfolioUpload.publicId}`,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[application] Portfolio upload failed", error);
      return sendError(res, "CV upload failed", 500);
    }
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
    ...(body.secondRoleId ? { secondRoleId: body.secondRoleId } : {}),
    ...(body.thirdRoleId ? { thirdRoleId: body.thirdRoleId } : {}),
    cvUrl: cvUpload.secureUrl,
    cvPublicId: cvUpload.publicId,
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

  const roleTitle = role?.title ?? "the selected position";

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
  const application = await ApplicationModel.findById(req.params.id)
    .populate("roleId", "title department status")
    .populate("secondRoleId", "title department status")
    .populate("thirdRoleId", "title department status");

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  return sendSuccess(res, application.toObject());
}
