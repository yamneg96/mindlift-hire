import type { Request, Response } from "express";
import mongoose from "mongoose";

import { RoleModel } from "../models/Role.js";
import { createRoleSchema, updateRoleSchema } from "../zod/role.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";

export async function listRoles(_req: Request, res: Response) {
  const roles = await RoleModel.find({ status: "open" })
    .sort({ createdAt: -1 })
    .lean();
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

  const role = await RoleModel.create({
    ...body,
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
  const role = await RoleModel.findByIdAndUpdate(req.params.id, body, {
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
