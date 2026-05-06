import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/Category.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.get("/", getCategories); // GET    /api/categories — PUBLIC
router.get("/:id", getCategory); // GET    /api/categories/:id — PUBLIC
router.post("/", protect, createCategory); // POST   /api/categories — ADMIN only
router.put("/:id", protect, updateCategory); // PUT    /api/categories/:id — ADMIN only
router.delete("/:id", protect, deleteCategory); // DELETE /api/categories/:id — ADMIN only

export default router;
