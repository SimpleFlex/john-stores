import express from "express";
import { getDashboardStats } from "../controllers/Dashboard.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

// GET /api/dashboard
// Returns: stat cards + recent orders for the Dashboard page
router.get("/", protect, getDashboardStats);

export default router;
