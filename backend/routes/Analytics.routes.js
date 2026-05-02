import express from "express";
import {
  getRevenueChart,
  getCategoryDistribution,
  getBrandPerformance,
  getAnalyticsSummary,
} from "../controllers/Analytics.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

// ── Individual routes — easy to test each chart separately ───────

// GET /api/analytics/revenue?range=7days
// Returns: bar chart data for Orders & Revenue
router.get("/revenue", protect, getRevenueChart);

// GET /api/analytics/categories
// Returns: pie chart data for category distribution
router.get("/categories", protect, getCategoryDistribution);

// GET /api/analytics/brands?range=7days
// Returns: bar chart data for brand performance
router.get("/brands", protect, getBrandPerformance);

// ── Combined route — fetches everything at once for Analytics page ──

// GET /api/analytics/summary?range=7days
// Returns: all 3 charts + stat cards in one call
router.get("/summary", protect, getAnalyticsSummary);

export default router;
