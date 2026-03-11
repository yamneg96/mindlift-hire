import { Router } from "express";

import {
  googleAuth,
  login,
  me,
  register,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/google", googleAuth);
authRoutes.get("/me", requireAuth, me);
authRoutes.get("/profile", requireAuth, me);
