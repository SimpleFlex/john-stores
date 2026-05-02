import EasyMedia from "../models/Easymedia.model.js";

// ── GET /api/easymedia ───────────────────────────────────────────
// Returns all early access emails
export const getEmails = async (req, res, next) => {
  try {
    const emails = await EasyMedia.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/easymedia ──────────────────────────────────────────
// Add a new early access email (called from the frontend landing page)
export const addEmail = async (req, res, next) => {
  try {
    const { name, email, location, avatar } = req.body;

    const existing = await EasyMedia.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const entry = await EasyMedia.create({ name, email, location, avatar });
    res.status(201).json({ success: true, entry });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/easymedia/:id ────────────────────────────────────
// Remove an email from the list
export const deleteEmail = async (req, res, next) => {
  try {
    const entry = await EasyMedia.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Email entry not found.",
      });
    }
    res.status(200).json({ success: true, message: "Email removed." });
  } catch (err) {
    next(err);
  }
};
