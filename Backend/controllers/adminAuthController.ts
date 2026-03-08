import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { adminLoginSchema, adminVerifyOtpSchema } from "../zod/adminAuth.js";
import {
  generateOtp,
  setOtp,
  verifyOtp,
} from "../services/auth/adminOtpStore.js";
import { sendAdminOtpEmail } from "../services/email/emailService.js";

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

function getAdminEmails() {
  const configuredAdmins = extractEmails(cleanEnv(process.env.ADMIN_EMAILS));
  const senderEmails = extractEmails(
    cleanEnv(process.env.EMAIL_FROM || process.env.Email_From),
  );

  return [...new Set([...configuredAdmins, ...senderEmails])];
}

function signAdminToken(email: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret missing");
  }

  return jwt.sign({ id: email, email, role: "admin" as const }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  });
}

export async function adminLogin(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof adminLoginSchema.parse>>(
    adminLoginSchema,
    req.body,
  );

  const email = body.email.toLowerCase().trim();
  const allowedAdmins = getAdminEmails();

  if (allowedAdmins.length === 0) {
    return sendError(res, "Admin emails are not configured", 500);
  }

  if (!allowedAdmins.includes(email)) {
    return sendError(res, "Unauthorized admin email", 401);
  }

  const otp = generateOtp();
  setOtp(email, otp, 10);
  await sendAdminOtpEmail(email, otp);

  return sendSuccess(res, { email, otpSent: true }, "OTP sent successfully");
}

export async function adminVerifyOtp(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof adminVerifyOtpSchema.parse>>(
    adminVerifyOtpSchema,
    req.body,
  );

  const email = body.email.toLowerCase().trim();
  const allowedAdmins = getAdminEmails();

  if (!allowedAdmins.includes(email)) {
    return sendError(res, "Unauthorized admin email", 401);
  }

  const result = verifyOtp(email, body.otp);
  if (!result.ok) {
    if (result.reason === "expired") {
      return sendError(res, "OTP expired", 401);
    }

    return sendError(res, "Invalid OTP", 401);
  }

  const token = signAdminToken(email);

  return sendSuccess(res, {
    token,
    user: {
      id: email,
      name: "Admin",
      email,
      role: "admin" as const,
    },
  });
}
