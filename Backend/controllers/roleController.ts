import type { Request, Response } from "express";
import mongoose from "mongoose";
import path from "node:path";

import { RoleModel } from "../models/Role.js";
import { createRoleSchema, updateRoleSchema } from "../zod/role.js";
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

async function resolveRoleImageUrl(req: Request): Promise<string | undefined> {
  const imageFile = req.file as Express.Multer.File | undefined;
  if (!imageFile) {
    return undefined;
  }

  const useCloud =
    String(process.env.USE_CLOUD_STORAGE).toLowerCase() === "true";

  if (useCloud) {
    return uploadToCloudStorage(imageFile.path, "role-images");
  }

  return buildPublicFileUrl(imageFile.path);
}

export async function listRoles(_req: Request, res: Response) {
  const roles = await RoleModel.find({ status: "open" })
    .sort({ createdAt: -1 })
    .lean();
  return sendSuccess(res, roles);
}

export async function listRolesForAdmin(_req: Request, res: Response) {
  const roles = await RoleModel.find({}).sort({ createdAt: -1 }).lean();
  return sendSuccess(res, roles);
}

export async function createRole(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const body = parseBody<ReturnType<typeof createRoleSchema.parse>>(
    createRoleSchema,
    req.body,
  );

  const creatorId = req.user.id;
  const hasObjectIdCreator = mongoose.Types.ObjectId.isValid(creatorId);
  const imageUrlFromUpload = await resolveRoleImageUrl(req);

  const role = await RoleModel.create({
    ...body,
    imageUrl: imageUrlFromUpload ?? body.imageUrl?.trim() ?? "",
    ...(hasObjectIdCreator ? { createdBy: creatorId } : {}),
    createdByEmail: req.user.email,
  });

  return sendSuccess(res, role, "Role created", 201);
}

export async function updateRole(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof updateRoleSchema.parse>>(
    updateRoleSchema,
    req.body,
  );
  const imageUrlFromUpload = await resolveRoleImageUrl(req);
  const updatePayload = {
    ...body,
    ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl.trim() } : {}),
    ...(imageUrlFromUpload ? { imageUrl: imageUrlFromUpload } : {}),
  };
  const role = await RoleModel.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!role) {
    return sendError(res, "Role not found", 404);
  }

  return sendSuccess(res, role, "Role updated");
}

export async function deleteRole(req: Request, res: Response) {
  const deleted = await RoleModel.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return sendError(res, "Role not found", 404);
  }

  return sendSuccess(res, { id: req.params.id }, "Role deleted");
}
