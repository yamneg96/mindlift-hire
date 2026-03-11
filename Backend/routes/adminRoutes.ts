import { Router } from "express";

import {
  deleteApplicationByAdmin,
  getAdminStats,
  listApplicationsForAdmin,
  listUsersForAdmin,
  updateApplicationByAdmin,
} from "../controllers/adminController.js";
import {
  adminLogin,
  adminVerifyOtp,
} from "../controllers/adminAuthController.js";
import { sendEmailToApplicants } from "../controllers/adminEmailController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const adminRoutes = Router();

adminRoutes.post("/login", adminLogin);
adminRoutes.post("/verify-otp", adminVerifyOtp);

adminRoutes.use(requireAuth, requireAdmin);
adminRoutes.get("/applications", listApplicationsForAdmin);
adminRoutes.patch("/applications/:id", updateApplicationByAdmin);
adminRoutes.delete("/applications/:id", deleteApplicationByAdmin);
adminRoutes.get("/stats", getAdminStats);
adminRoutes.get("/dashboard", getAdminStats);
adminRoutes.get("/users", listUsersForAdmin);
adminRoutes.post("/send-email", sendEmailToApplicants);
