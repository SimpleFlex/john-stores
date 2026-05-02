import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMe,
  updatePassword,
  getAllAdmins,
  deactivateAdmin,
} from "../controllers/Auth.controller.js";
import { protect, superAdminOnly } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin); // POST /api/auth/register
router.post("/login", loginAdmin); // POST /api/auth/login
router.post("/logout", protect, logoutAdmin); // POST /api/auth/logout
router.get("/me", protect, getMe); // GET  /api/auth/me
router.put("/update-password", protect, updatePassword); // PUT /api/auth/update-password

// Superadmin only
router.get("/admins", protect, superAdminOnly, getAllAdmins); // GET  /api/auth/admins
router.put("/admins/:id/deactivate", protect, superAdminOnly, deactivateAdmin); // PUT /api/auth/admins/:id/deactivate

export default router;
