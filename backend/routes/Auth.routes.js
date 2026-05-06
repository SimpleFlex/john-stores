import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMe,
  updateProfile,
  updatePassword,
  updateEmail,
  getAllAdmins,
  deactivateAdmin,
} from "../controllers/Auth.controller.js";
import { protect, superAdminOnly } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", protect, logoutAdmin);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);
router.put("/update-email", protect, updateEmail);

// Superadmin only
router.get("/admins", protect, superAdminOnly, getAllAdmins);
router.put("/admins/:id/deactivate", protect, superAdminOnly, deactivateAdmin);

export default router;
