import type { Request, Response } from "express";

import { UserModel } from "../models/User.js";
import { sendError, sendSuccess } from "../utils/response.js";

export async function register(req: Request, res: Response) {
  return sendError(
    res,
    "Applicant signup is disabled. Use /api/admin/login for admin OTP authentication.",
    410,
  );
}

export async function login(req: Request, res: Response) {
  return sendError(
    res,
    "Password login is disabled. Use /api/admin/login for admin OTP authentication.",
    410,
  );
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return sendError(res, "Unauthorized", 401);
  }

  const user = await UserModel.findById(req.user.id).select("-password").lean();
  if (!user) {
    return sendError(res, "User not found", 404);
  }

  return sendSuccess(res, user);
}
