import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

// Helper: generate token and set cookie
const sendTokenResponse = (admin, statusCode, res) => {
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Remove password from response
  admin.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    admin,
  });
};

// ── Register Admin (superadmin only in production) ───────────────
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    const admin = await Admin.create({ name, email, password, role });
    sendTokenResponse(admin, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── Login ────────────────────────────────────────────────────────
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !admin.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    sendTokenResponse(admin, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── Logout ───────────────────────────────────────────────────────
export const logoutAdmin = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// ── Get current logged-in admin ──────────────────────────────────
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
};

// ── Update password ──────────────────────────────────────────────
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select("+password");
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect." });
    }

    admin.password = newPassword;
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── Get all admins (superadmin only) ─────────────────────────────
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, admins });
  } catch (err) {
    next(err);
  }
};

// ── Deactivate admin (superadmin only) ───────────────────────────
export const deactivateAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "Admin deactivated.", admin });
  } catch (err) {
    next(err);
  }
};
