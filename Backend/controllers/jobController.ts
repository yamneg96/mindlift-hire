import type { Request, Response } from "express";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";

import { JobModel } from "../models/Job.js";
import { createJobSchema, updateJobSchema } from "../zod/job.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { uploadBufferToCloudStorage } from "../config/cloudStorage.js";

function buildPublicFileUrl(filePath: string) {
  const normalized = filePath.replace(/\\/g, "/");
  const configuredBase = (process.env.UPLOAD_BASE_URL ?? "").trim();
  const defaultCloudinaryBase =
    (process.env.CLOUDINARY_UPLOAD_BASE_URL ?? "").trim() ||
    "https://res.cloudinary.com/dmylzrvse/image/upload";
  const base =
    configuredBase && !configuredBase.includes("mindlift-backend.vercel")
      ? configuredBase
      : defaultCloudinaryBase;
  const normalizedBase = base.replace(/\/$/, "");
  if (normalized.startsWith("/uploads")) {
    return `${normalizedBase}${normalized}`;
  }

  const uploadsIndex = normalized.indexOf("uploads/");
  if (uploadsIndex >= 0) {
    return `${normalizedBase}/${normalized.slice(uploadsIndex)}`;
  }

  return `${normalizedBase}/${path.basename(normalized)}`;
}

async function resolveJobImageUrl(req: Request): Promise<string | undefined> {
  const imageFile = req.file as Express.Multer.File | undefined;
  if (!imageFile) {
    return undefined;
  }

  const useCloud =
    String(process.env.USE_CLOUD_STORAGE).toLowerCase() === "true";

  if (useCloud) {
    const fileBuffer = await fs.readFile(imageFile.path);
    try {
      return await uploadBufferToCloudStorage({
        file: fileBuffer,
        fileName: `job_image_${Date.now()}`,
        folder: "/ml-job-image",
        resourceType: "image",
      });
    } finally {
      await fs.unlink(imageFile.path).catch(() => undefined);
    }
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
