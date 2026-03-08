import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      id: string;
      role: "user" | "admin";
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
