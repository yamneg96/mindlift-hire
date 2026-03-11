import { Router } from "express";

import {
  createRole,
  deleteRole,
  listRoles,
  listRolesForAdmin,
  updateRole,
} from "../controllers/roleController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { roleImageUpload } from "../middleware/uploadMiddleware.js";

export const roleRoutes = Router();

roleRoutes.get("/", listRoles);
roleRoutes.get("/admin/all", requireAuth, requireAdmin, listRolesForAdmin);
roleRoutes.post(
  "/",
  requireAuth,
  requireAdmin,
  roleImageUpload.single("image"),
  createRole,
);
roleRoutes.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  roleImageUpload.single("image"),
  updateRole,
);
roleRoutes.delete("/:id", requireAuth, requireAdmin, deleteRole);
