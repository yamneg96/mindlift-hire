import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { SignOptions } from "jsonwebtoken";

import { UserModel } from "../models/User.js";
import { loginSchema, registerSchema } from "../zod/auth.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";

function signToken(payload: Express.UserPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret missing");
  }

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  });
}

export async function register(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof registerSchema.parse>>(
    registerSchema,
    req.body,
  );

  const exists = await UserModel.findOne({ email: body.email }).lean();
  if (exists) {
    return sendError(res, "Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = await UserModel.create({
    ...body,
    password: hashedPassword,
    role: body.role ?? "user",
    profile: body.profile ?? {},
  });

  const token = signToken({
    id: String(user._id),
    role: user.role,
    email: user.email,
  });

  return sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    },
    "Registration successful",
    201,
  );
}

export async function login(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof loginSchema.parse>>(
    loginSchema,
    req.body,
  );

  const user = await UserModel.findOne({ email: body.email });
  if (!user) {
    return sendError(res, "Invalid credentials", 401);
  }

  const valid = await bcrypt.compare(body.password, user.password);
  if (!valid) {
    return sendError(res, "Invalid credentials", 401);
  }

  const token = signToken({
    id: String(user._id),
    role: user.role,
    email: user.email,
  });

  return sendSuccess(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
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
