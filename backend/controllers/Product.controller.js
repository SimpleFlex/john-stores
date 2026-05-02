import Product from "../models/Product.model.js";
import cloudinary from "../config/Cloudinary.js";

// ── Get all products ─────────────────────────────────────────────
export const getProducts = async (req, res, next) => {
  try {
    const { brand, category, status, isFeatured, search } = req.query;
    const filter = {};

    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (search) filter.productName = { $regex: search, $options: "i" };

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// ── Get single product ───────────────────────────────────────────
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── Create product ───────────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      brand,
      category,
      description,
      price,
      stockQuantity,
      sizeOptions,
      isFeatured,
    } = req.body;

    // Upload images to Cloudinary if files exist
    let images = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "je-admin/products",
        });
        images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    // Also handle URL images passed as JSON
    if (req.body.imageUrls) {
      const urls = Array.isArray(req.body.imageUrls)
        ? req.body.imageUrls
        : JSON.parse(req.body.imageUrls);
      urls.forEach((url) => images.push({ url, public_id: "" }));
    }

    const product = await Product.create({
      productName,
      brand,
      category,
      description,
      images,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      sizeOptions: sizeOptions
        ? Array.isArray(sizeOptions)
          ? sizeOptions
          : JSON.parse(sizeOptions)
        : [],
      isFeatured: isFeatured === "true",
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── Update product ───────────────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const {
      productName,
      brand,
      category,
      description,
      price,
      stockQuantity,
      sizeOptions,
      isFeatured,
      removeImageIds,
    } = req.body;

    // Remove deleted images from Cloudinary
    if (removeImageIds) {
      const ids = JSON.parse(removeImageIds);
      for (const public_id of ids) {
        if (public_id) await cloudinary.uploader.destroy(public_id);
      }
      product.images = product.images.filter(
        (img) => !ids.includes(img.public_id),
      );
    }

    // Upload new images
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "je-admin/products",
        });
        product.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // Add new URL images
    if (req.body.imageUrls) {
      const urls = JSON.parse(req.body.imageUrls);
      urls.forEach((url) => product.images.push({ url, public_id: "" }));
    }

    // Update fields
    if (productName) product.productName = productName;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stockQuantity !== undefined)
      product.stockQuantity = Number(stockQuantity);
    if (sizeOptions) product.sizeOptions = JSON.parse(sizeOptions);
    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true";

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── Delete product ───────────────────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Delete all images from Cloudinary
    for (const img of product.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    next(err);
  }
};
