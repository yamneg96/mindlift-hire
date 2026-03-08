import { Router } from "express";

import {
  createRole,
  deleteRole,
  listRoles,
  updateRole,
} from "../controllers/roleController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const roleRoutes = Router();

roleRoutes.get("/", listRoles);
roleRoutes.post("/", requireAuth, requireAdmin, createRole);
roleRoutes.patch("/:id", requireAuth, requireAdmin, updateRole);
roleRoutes.delete("/:id", requireAuth, requireAdmin, deleteRole);
