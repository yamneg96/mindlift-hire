import type { Request, Response } from "express";
import mongoose from "mongoose";
import path from "node:path";

import { JobModel } from "../models/Job.js";
import { createJobSchema, updateJobSchema } from "../zod/job.js";
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

async function resolveJobImageUrl(req: Request): Promise<string | undefined> {
  const imageFile = req.file as Express.Multer.File | undefined;
  if (!imageFile) {
    return undefined;
  }

  const useCloud =
    String(process.env.USE_CLOUD_STORAGE).toLowerCase() === "true";

  if (useCloud) {
    return uploadToCloudStorage(imageFile.path, "ml-role-image");
  }

  return buildPublicFileUrl(imageFile.path);
}

export async function listJobs(_req: Request, res: Response) {
  const jobs = await JobModel.find({ status: "open" })
    .sort({ createdAt: -1 })
    .lean();
  return sendSuccess(res, jobs);
}

export async function listJobsForAdmin(_req: Request, res: Response) {
  const jobs = await JobModel.find({}).sort({ createdAt: -1 }).lean();
  return sendSuccess(res, jobs);
}

export async function createJob(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const body = parseBody<ReturnType<typeof createJobSchema.parse>>(
    createJobSchema,
    req.body,
  );

  const creatorId = req.user.id;
  const hasObjectIdCreator = mongoose.Types.ObjectId.isValid(creatorId);
  const imageUrlFromUpload = await resolveJobImageUrl(req);

  const job = await JobModel.create({
    ...body,
    imageUrl: imageUrlFromUpload ?? body.imageUrl?.trim() ?? "",
    ...(hasObjectIdCreator ? { createdBy: creatorId } : {}),
    createdByEmail: req.user.email,
  });

  return sendSuccess(res, job, "Job created", 201);
}

export async function updateJob(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof updateJobSchema.parse>>(
    updateJobSchema,
    req.body,
  );
  const imageUrlFromUpload = await resolveJobImageUrl(req);
  const updatePayload = {
    ...body,
    ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl.trim() } : {}),
    ...(imageUrlFromUpload ? { imageUrl: imageUrlFromUpload } : {}),
  };

  const job = await JobModel.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return sendError(res, "Job not found", 404);
  }

  return sendSuccess(res, job, "Job updated");
}

export async function deleteJob(req: Request, res: Response) {
  const deleted = await JobModel.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return sendError(res, "Job not found", 404);
  }

  return sendSuccess(res, { id: req.params.id }, "Job deleted");
}
