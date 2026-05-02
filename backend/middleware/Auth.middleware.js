import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Please log in." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from DB
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found or deactivated." });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

// Only superadmin can access
export const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== "superadmin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Superadmin only." });
  }
  next();
};
