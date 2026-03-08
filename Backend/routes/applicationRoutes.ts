import { Router } from "express";

import {
  applyForRole,
  getApplicationById,
  listMyApplications,
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

export const applicationRoutes = Router();

applicationRoutes.post(
  "/apply",
  requireAuth,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "portfolio", maxCount: 1 },
  ]),
  applyForRole,
);
applicationRoutes.get("/my", requireAuth, listMyApplications);
applicationRoutes.get("/:id", requireAuth, getApplicationById);
