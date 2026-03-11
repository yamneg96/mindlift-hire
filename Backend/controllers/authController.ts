import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { UserModel } from "../models/User.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { googleAuthSchema } from "../zod/auth.js";

const googleClient = new OAuth2Client();

function cleanEnv(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^['\"]|['\"]$/g, "");
}

function extractEmails(raw: string) {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/<([^>]+)>/);
      return (match?.[1] ?? part).trim().toLowerCase();
    })
    .filter((item) => item.includes("@"));
}

function getAllowedAdminEmails() {
  return extractEmails(cleanEnv(process.env.ADMIN_EMAILS));
}

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
  try {
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

    const allowedAdmins = getAllowedAdminEmails();
    if (!allowedAdmins.includes(email)) {
      return sendError(res, "Unauthorized admin email", 401);
    }

    const role = "admin" as const;
    const token = signLocalToken({
      id: email,
      email,
      role,
    });

    return sendSuccess(res, {
      token,
      user: {
        id: email,
        name: payload?.name?.trim() || "Admin",
        email,
        role,
      },
    });
  } catch (error) {
    const rawMessage = (error as Error)?.message ?? "unknown error";
    // eslint-disable-next-line no-console
    console.error(`[auth/google] verifyIdToken failed: ${rawMessage}`);
    const message = rawMessage.toLowerCase();
    if (message.includes("wrong recipient") || message.includes("audience")) {
      return sendError(
        res,
        "Google client mismatch: token audience does not match backend GOOGLE_CLIENT_ID",
        401,
      );
    }
    if (message.includes("origin") || message.includes("not allowed")) {
      return sendError(
        res,
        "Google origin not allowed for this client ID",
        401,
      );
    }
    if (message.includes("token") || message.includes("jwt")) {
      return sendError(res, "Invalid Google credential", 401);
    }

    return sendError(res, "Google sign-in failed", 500);
  }
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
