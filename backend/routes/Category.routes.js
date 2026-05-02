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

router.get("/", protect, getCategories); // GET    /api/categories
router.get("/:id", protect, getCategory); // GET    /api/categories/:id
router.post("/", protect, createCategory); // POST   /api/categories
router.put("/:id", protect, updateCategory); // PUT    /api/categories/:id
router.delete("/:id", protect, deleteCategory); // DELETE /api/categories/:id

export default router;
