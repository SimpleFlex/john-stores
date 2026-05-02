import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: { type: String, required: true }, // snapshot at time of order
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: "" },
  image: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    // Auto-generated e.g. JS-2026-021
    orderId: {
      type: String,
      unique: true,
    },

    brand: {
      type: String,
      enum: ["John's Stores", "Swift Logistics"],
      required: [true, "Brand is required"],
    },

    // ── Sender (the person placing the order) ────────────────────
    sender: { type: String, required: [true, "Sender name is required"] },
    senderPhone: { type: String, default: "" },
    senderEmail: { type: String, default: "" },

    // ── Recipient (who receives the gift) ────────────────────────
    // Optional — only for gift orders
    recipient: {
      name: { type: String, default: "-" },
      phone: { type: String, default: "-" },
      address: { type: String, default: "" },
    },

    // ── Items ────────────────────────────────────────────────────
    items: [orderItemSchema],

    // ── Pricing ──────────────────────────────────────────────────
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },

    // ── Status ───────────────────────────────────────────────────
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },

    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

// ── Auto-generate orderId before saving ──────────────────────────
orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    const year = new Date().getFullYear();
    this.orderId = `JS-${year}-${String(count + 1).padStart(3, "0")}`;
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
