import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: "" },
  image: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },

    brand: {
      type: String,
      enum: ["John's Stores", "Swift Logistics"],
      required: [true, "Brand is required"],
    },

    sender: { type: String, required: [true, "Sender name is required"] },
    senderPhone: { type: String, default: "" },
    senderEmail: { type: String, default: "" },

    recipient: {
      name: { type: String, default: "-" },
      phone: { type: String, default: "-" },
      address: { type: String, default: "" },
    },

    items: [orderItemSchema],

    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },

    // ── Profit & Final Price ────────────────────────────────────
    finalPrice: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },

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

orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    const year = new Date().getFullYear();
    this.orderId = `JS-${year}-${String(count + 1).padStart(3, "0")}`;
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
