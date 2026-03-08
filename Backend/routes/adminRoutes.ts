import { Router } from "express";

import {
  getAdminStats,
  listApplicationsForAdmin,
  listUsersForAdmin,
  updateApplicationByAdmin,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);
adminRoutes.get("/applications", listApplicationsForAdmin);
adminRoutes.patch("/applications/:id", updateApplicationByAdmin);
adminRoutes.get("/stats", getAdminStats);
adminRoutes.get("/users", listUsersForAdmin);
