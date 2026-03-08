import { Router } from "express";

import {
  applyForRole,
  getApplicationById,
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

export const applicationRoutes = Router();

applicationRoutes.post(
  "/apply",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "portfolio", maxCount: 1 },
  ]),
  applyForRole,
);
applicationRoutes.get("/:id", requireAuth, requireAdmin, getApplicationById);
