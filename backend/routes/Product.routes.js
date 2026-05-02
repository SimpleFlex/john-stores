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

router.get("/", protect, getProducts); // GET    /api/products
router.get("/:id", protect, getProduct); // GET    /api/products/:id
router.post("/", protect, createProduct); // POST   /api/products
router.put("/:id", protect, updateProduct); // PUT    /api/products/:id
router.delete("/:id", protect, deleteProduct); // DELETE /api/products/:id

export default router;
