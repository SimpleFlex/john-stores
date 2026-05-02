import Order from "../models/Order.model.js";
import { sendEmail } from "../config/Email.js";

// ── GET /api/orders ──────────────────────────────────────────────
// Query params: ?brand=John's Stores | ?paymentStatus=Pending | ?orderStatus=Completed
export const getOrders = async (req, res, next) => {
  try {
    const { brand, paymentStatus, orderStatus } = req.query;
    const filter = {};

    if (brand) filter.brand = brand;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (orderStatus) filter.orderStatus = orderStatus;

    const orders = await Order.find(filter)
      .populate("items.product", "productName images")
      .sort({ createdAt: -1 });

    // ── Tab counts for the Orders page tabs ──────────────────────
    const [total, johnsCount, swiftCount, pendingCount, completedCount] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ brand: "John's Stores" }),
        Order.countDocuments({ brand: "Swift Logistics" }),
        Order.countDocuments({ paymentStatus: "Pending" }),
        Order.countDocuments({ orderStatus: "Completed" }),
      ]);

    res.status(200).json({
      success: true,
      tabCounts: {
        all: total,
        johns: johnsCount,
        swift: swiftCount,
        pending: pendingCount,
        completed: completedCount,
      },
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/:id ──────────────────────────────────────────
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "productName images price",
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/orders ─────────────────────────────────────────────
// Public — called from frontend checkout
export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);

    // ✅ Wrapped in its own try/catch — order saves even if email fails
    try {
      if (order.senderEmail) {
        await sendEmail({
          to: order.senderEmail,
          subject: `Order Confirmed - ${order.orderId}`,
          html: `
            <h2>Thank you, ${order.sender}!</h2>
            <p>Your order <strong>${order.orderId}</strong> has been received.</p>
            <p><strong>Subtotal:</strong> ₦${order.subtotal?.toLocaleString()}</p>
            <p><strong>Delivery Fee:</strong> ₦${order.deliveryFee?.toLocaleString()}</p>
            <p><strong>Total:</strong> ₦${order.total?.toLocaleString()}</p>
            <p>We'll notify you once your order is on its way.</p>
          `,
        });
      }
    } catch (emailErr) {
      console.log("⚠️ Email failed but order was saved:", emailErr.message);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/payment ──────────────────────────────────
// Mark order as Paid / Pending / Refunded
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.paymentStatus = paymentStatus;

    // Auto-move to Processing when marked as Paid
    if (paymentStatus === "Paid" && order.orderStatus === "Pending") {
      order.orderStatus = "Processing";
    }

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/status ───────────────────────────────────
// Update order status + notify customer via email
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Notify sender by email
    if (order.senderEmail) {
      await sendEmail({
        to: order.senderEmail,
        subject: `Order Update - ${order.orderId}`,
        html: `
          <h2>Hello ${order.sender},</h2>
          <p>Your order <strong>${order.orderId}</strong> has been updated to: <strong>${orderStatus}</strong>.</p>
        `,
      });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/complete ─────────────────────────────────
// Quick action — mark order as Completed directly from the table
export const completeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.orderStatus = "Completed";
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/orders/:id ───────────────────────────────────────
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, message: "Order deleted." });
  } catch (err) {
    next(err);
  }
};
