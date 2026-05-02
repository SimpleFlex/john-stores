import express from "express";
import {
  getEmails,
  addEmail,
  deleteEmail,
} from "../controllers/Easymedia.controller.js";
import { protect } from "../middleware/Auth.middleware.js";

const router = express.Router();

// GET    /api/easymedia        — get all emails (admin only)
router.get("/", protect, getEmails);

// POST   /api/easymedia        — add email (public — from frontend landing page)
router.post("/", addEmail);

// DELETE /api/easymedia/:id    — remove email (admin only)
router.delete("/:id", protect, deleteEmail);

export default router;
