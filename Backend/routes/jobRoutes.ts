import { Router } from "express";

import {
  createJob,
  deleteJob,
  listJobs,
  listJobsForAdmin,
  updateJob,
} from "../controllers/jobController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { roleImageUpload } from "../middleware/uploadMiddleware.js";

export const jobRoutes = Router();

jobRoutes.get("/", listJobs);
jobRoutes.get("/admin/all", requireAuth, requireAdmin, listJobsForAdmin);
jobRoutes.post(
  "/",
  requireAuth,
  requireAdmin,
  roleImageUpload.single("image"),
  createJob,
);
jobRoutes.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  roleImageUpload.single("image"),
  updateJob,
);
jobRoutes.delete("/:id", requireAuth, requireAdmin, deleteJob);
