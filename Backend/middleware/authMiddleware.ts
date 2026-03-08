import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res
      .status(500)
      .json({ success: false, message: "JWT secret missing" });
  }

  try {
    const payload = jwt.verify(token, secret) as Express.UserPayload;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
