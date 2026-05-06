import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/Product.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.get("/", getProducts); // GET    /api/products — PUBLIC
router.get("/:id", getProduct); // GET    /api/products/:id — PUBLIC
router.post("/", protect, createProduct); // POST   /api/products — ADMIN only
router.put("/:id", protect, updateProduct); // PUT    /api/products/:id — ADMIN only
router.delete("/:id", protect, deleteProduct); // DELETE /api/products/:id — ADMIN only

export default router;
