import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { RoleModel } from "../models/Role.js";
import { ApplicationModel } from "../models/Application.js";
import { createRoleBulkSchema, createRoleSchema, updateRoleSchema, } from "../zod/role.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { uploadBufferToCloudStorage } from "../config/cloudStorage.js";
function buildPublicFileUrl(req, filePath) {
    const normalized = filePath.replace(/\\/g, "/");
    const configuredBase = (process.env.UPLOAD_BASE_URL ?? "").trim();
    // Local uploads should never be prefixed with Cloudinary base URLs.
    const requestBase = `${req.protocol}://${req.get("host") ?? ""}`.replace(/\/$/, "");
    const base = /res\.cloudinary\.com/i.test(configuredBase)
        ? ""
        : configuredBase || requestBase;
    const normalizedBase = base.replace(/\/$/, "");
    if (normalized.startsWith("/uploads")) {
        return normalizedBase ? `${normalizedBase}${normalized}` : normalized;
    }
    const uploadsIndex = normalized.indexOf("uploads/");
    if (uploadsIndex >= 0) {
        return normalizedBase
            ? `${normalizedBase}/${normalized.slice(uploadsIndex)}`
            : `/${normalized.slice(uploadsIndex)}`;
    }
    return normalizedBase
        ? `${normalizedBase}/${path.basename(normalized)}`
        : `/${path.basename(normalized)}`;
}
async function resolveRoleImageUrl(req) {
    const imageFile = req.file;
    if (!imageFile) {
        return undefined;
    }
    const cloudCredentialsConfigured = Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
        Boolean(process.env.CLOUDINARY_API_KEY) &&
        Boolean(process.env.CLOUDINARY_API_SECRET);
    const useCloud = String(process.env.USE_CLOUD_STORAGE ?? "true").toLowerCase() !== "false" &&
        cloudCredentialsConfigured;
    if (useCloud) {
        const fileBuffer = await fs.readFile(imageFile.path);
        try {
            return await uploadBufferToCloudStorage({
                file: fileBuffer,
                fileName: `role_image_${Date.now()}`,
                folder: "/ml-role-image",
                resourceType: "image",
            });
        }
        finally {
            await fs.unlink(imageFile.path).catch(() => undefined);
        }
    }
    return buildPublicFileUrl(req, imageFile.path);
}
export async function listRoles(req, res) {
    const includeClosed = String(req.query.includeClosed ?? "false").toLowerCase() === "true";
    const roles = await RoleModel.find(includeClosed ? {} : { status: "open" })
        .sort({ createdAt: -1 })
        .lean();
    return sendSuccess(res, roles);
}
export async function listRolesForAdmin(_req, res) {
    const roles = await RoleModel.find({}).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, roles);
}
export async function createRole(req, res) {
    if (!req.user) {
        return sendError(res, "Unauthorized", 401);
    }
    const body = parseBody(createRoleSchema, req.body);
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
export async function createRolesBulk(req, res) {
    if (!req.user) {
        return sendError(res, "Unauthorized", 401);
    }
    const roles = createRoleBulkSchema.parse(req.body);
    const creatorId = req.user.id;
    const hasObjectIdCreator = mongoose.Types.ObjectId.isValid(creatorId);
    const created = await RoleModel.insertMany(roles.map((item) => ({
        ...item,
        imageUrl: item.imageUrl?.trim() ?? "",
        ...(hasObjectIdCreator ? { createdBy: creatorId } : {}),
        createdByEmail: req.user?.email,
    })));
    return sendSuccess(res, created, "Roles created", 201);
}
export async function updateRole(req, res) {
    const body = parseBody(updateRoleSchema, req.body);
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
export async function deleteRole(req, res) {
    const roleId = req.params.id;
    const deleted = await RoleModel.findByIdAndDelete(roleId);
    if (!deleted) {
        return sendError(res, "Role not found", 404);
    }
    const cascadeResult = await ApplicationModel.deleteMany({
        $or: [{ roleId }, { secondRoleId: roleId }, { thirdRoleId: roleId }],
    });
    return sendSuccess(res, { id: roleId, deletedApplications: cascadeResult.deletedCount ?? 0 }, "Role and related applications deleted");
}
