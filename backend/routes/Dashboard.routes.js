import express from "express";
import {
  getDashboardStats,
  resetDashboard,
} from "../controllers/Dashboard.controller.js";
import { protect, superAdminOnly } from "../middleware/Auth.middleware.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", protect, getDashboardStats);

// POST /api/dashboard/reset — superadmin only
router.post("/reset", protect, superAdminOnly, resetDashboard);

export default router;
