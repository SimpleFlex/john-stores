import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      enum: ["John's Stores", "Swift Logistics"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: "" },
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: 0,
      default: 0,
    },
    sizeOptions: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true },
);

// ── Auto-update status based on stockQuantity ────────────────────
// Uses async pre-save — no next() needed in Mongoose 9
productSchema.pre("save", async function () {
  // Always recalculate status from current stockQuantity
  this.status = this.stockQuantity > 0 ? "In Stock" : "Out of Stock";
});

// ── Guard against OverwriteModelError ────────────────────────────
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
