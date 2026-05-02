import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updatePaymentStatus,
  updateOrderStatus,
  completeOrder,
  deleteOrder,
} from "../controllers/Order.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

// GET    /api/orders                      — get all orders + tab counts
// GET    /api/orders?brand=John's Stores  — filter by brand
// GET    /api/orders?paymentStatus=Pending
// GET    /api/orders?orderStatus=Completed
router.get("/", protect, getOrders);

// GET    /api/orders/:id                  — get single order with items
router.get("/:id", protect, getOrder);

// POST   /api/orders                      — create order (public from frontend)
router.post("/", createOrder);

// PUT    /api/orders/:id/payment          — update payment status (Paid/Pending/Refunded)
router.put("/:id/payment", protect, updatePaymentStatus);

// PUT    /api/orders/:id/status           — update order status + email notification
router.put("/:id/status", protect, updateOrderStatus);

// PUT    /api/orders/:id/complete         — quick complete action from table
router.put("/:id/complete", protect, completeOrder);

// DELETE /api/orders/:id                  — delete order
router.delete("/:id", protect, deleteOrder);

export default router;
