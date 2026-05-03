import Category from "../models/category.model.js";
import cloudinary from "../config/Cloudinary.js";

// ── GET all categories ───────────────────────────────────────────
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

// ── GET single category ──────────────────────────────────────────
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// ── CREATE category ──────────────────────────────────────────────
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, brand } = req.body;

    let image = { url: "", public_id: "" };
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "je-admin/categories" },
      );
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const category = await Category.create({
      name,
      description,
      brand: brand || "John's Stores",
      image,
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE category ──────────────────────────────────────────────
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // ── Update image if new one uploaded ────────────────────────
    if (req.files?.image) {
      if (category.image.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "je-admin/categories" },
      );
      category.image = { url: result.secure_url, public_id: result.public_id };
    }

    // ── Update fields — explicitly save brand ────────────────────
    const { name, description, isActive, brand } = req.body;

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive === "true";

    // ── This is the key fix — always save brand when provided ────
    if (brand) {
      category.brand = brand;
    }

    await category.save();

    res.status(200).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// ── DELETE category ──────────────────────────────────────────────
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    if (category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }
    await category.deleteOne();
    res.status(200).json({ success: true, message: "Category deleted." });
  } catch (err) {
    next(err);
  }
};
