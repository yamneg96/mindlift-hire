import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { UserModel } from "../models/User.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { googleAuthSchema } from "../zod/auth.js";

const googleClient = new OAuth2Client();

function getGoogleClientIds() {
  return [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_IDS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim().replace(/^['\"]|['\"]$/g, ""))
    .filter(Boolean);
}

function signLocalToken(payload: {
  id: string;
  email: string;
  role: "user" | "admin";
}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret missing");
  }

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  });
}

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

export async function googleAuth(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof googleAuthSchema.parse>>(
    googleAuthSchema,
    req.body,
  );

  const googleClientIds = getGoogleClientIds();
  if (googleClientIds.length === 0) {
    return sendError(res, "Google client ID is not configured", 500);
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: body.credential,
    audience: googleClientIds,
  });
  const payload = ticket.getPayload();

  const email = payload?.email?.toLowerCase().trim();
  if (!email || payload?.email_verified !== true) {
    return sendError(res, "Invalid Google account", 401);
  }

  // Existing-user only policy: no automatic signup.
  const [existingUser] = await UserModel.find({ email })
    .select("_id name email role")
    .limit(1)
    .lean();
  if (!existingUser) {
    return sendError(res, "User not found", 401);
  }

  const role = (existingUser.role ?? "admin") as "user" | "admin";
  const token = signLocalToken({
    id: String(existingUser._id),
    email,
    role,
  });

  return sendSuccess(res, {
    token,
    user: {
      id: String(existingUser._id),
      name: existingUser.name,
      email,
      role,
    },
  });
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
