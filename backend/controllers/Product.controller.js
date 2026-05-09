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
      color,
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

    // Upload color-specific images
    let colorImages = {};
    if (color) {
      const colors = Array.isArray(color) ? color : JSON.parse(color);
      for (const clr of colors) {
        const fieldName = `colorImage_${clr}`;
        if (req.files && req.files[fieldName]) {
          const file = Array.isArray(req.files[fieldName])
            ? req.files[fieldName][0]
            : req.files[fieldName];
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "je-admin/products/colors",
          });
          colorImages[clr] = result.secure_url;
        }
      }
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
      color: color ? (Array.isArray(color) ? color : JSON.parse(color)) : [],
      colorImages: colorImages,
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
      color,
      isFeatured,
      removeImageIds,
      removeColorImages,
    } = req.body;

    // Remove deleted color images from Cloudinary
    if (removeColorImages) {
      let removedColors = [];
      try {
        removedColors = JSON.parse(removeColorImages);
      } catch {
        removedColors = Array.isArray(removeColorImages)
          ? removeColorImages
          : [];
      }
      for (const clr of removedColors) {
        const oldUrl = product.colorImages?.get?.(clr);
        if (oldUrl) {
          try {
            const publicId = oldUrl
              .split("/")
              .slice(-2)
              .join("/")
              .split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {
            // ignore cleanup errors
          }
          product.colorImages.delete(clr);
        }
      }
    }

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

    // Upload new color images
    if (color) {
      const colors = Array.isArray(color) ? color : JSON.parse(color);
      for (const clr of colors) {
        const fieldName = `colorImage_${clr}`;
        if (req.files && req.files[fieldName]) {
          // Delete old color image if exists
          const oldUrl = product.colorImages?.get?.(clr);
          if (oldUrl) {
            try {
              const publicId = oldUrl
                .split("/")
                .slice(-2)
                .join("/")
                .split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (e) {
              // ignore cleanup errors
            }
          }

          const file = Array.isArray(req.files[fieldName])
            ? req.files[fieldName][0]
            : req.files[fieldName];
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "je-admin/products/colors",
          });
          product.colorImages.set(clr, result.secure_url);
        }
      }
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
    if (color) product.color = Array.isArray(color) ? color : JSON.parse(color);
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

    // Delete color images from Cloudinary
    if (product.colorImages) {
      for (const [color, url] of product.colorImages) {
        if (url) {
          try {
            const publicId = url.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {
            // ignore
          }
        }
      }
    }

    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    next(err);
  }
};
