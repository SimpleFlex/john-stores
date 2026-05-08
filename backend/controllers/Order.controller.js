import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Notification from "../models/Notification.model.js";
import { sendEmail } from "../config/Email.js";
import {
  orderConfirmationTemplate,
  paymentConfirmedTemplate,
  orderCompletedTemplate,
} from "../utils/emailTemplates.js";

// ── GET /api/orders ──────────────────────────────────────────────
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
export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);

    try {
      if (order.senderEmail) {
        await sendEmail({
          to: order.senderEmail,
          subject: `Order Confirmed - ${order.orderId}`,
          html: orderConfirmationTemplate(order),
        });
      }
    } catch (emailErr) {
      console.log("⚠️ Email failed but order was saved:", emailErr.message);
    }

    try {
      await Notification.create({
        title: "New Order",
        message: `#${order.orderId} from ${order.sender} — ₦${order.total?.toLocaleString()}`,
        type: "order",
        link: `/orders?orderId=${order.orderId}`,
      });
    } catch (notifErr) {
      console.log("⚠️ Notification creation failed:", notifErr.message);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/payment ──────────────────────────────────
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, finalPrice, profit } = req.body;
    console.log("📥 Received payment update:", {
      paymentStatus,
      finalPrice,
      profit,
    });

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const wasAlreadyPaid = order.paymentStatus === "Paid";
    order.paymentStatus = paymentStatus;

    // Save finalPrice and profit if provided
    if (finalPrice !== undefined && finalPrice !== null) {
      order.finalPrice = Number(finalPrice);
    }
    if (profit !== undefined && profit !== null) {
      order.profit = Number(profit);
    }

    console.log("💾 Saving to order:", {
      finalPrice: order.finalPrice,
      profit: order.profit,
    });

    if (paymentStatus === "Paid" && order.orderStatus === "Pending") {
      order.orderStatus = "Processing";
    }

    await order.save();

    // Decrease stock when payment is confirmed (only if not already paid)
    if (paymentStatus === "Paid" && !wasAlreadyPaid) {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stockQuantity: -item.quantity },
          });
        }
      }
      console.log("📦 Stock decreased for order:", order.orderId);
    }

    // Send payment confirmation email
    if (paymentStatus === "Paid" && order.senderEmail) {
      try {
        await sendEmail({
          to: order.senderEmail,
          subject: `Payment Confirmed - ${order.orderId}`,
          html: paymentConfirmedTemplate(order),
        });
      } catch (emailErr) {
        console.log("⚠️ Payment email failed:", emailErr.message);
      }
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/status ───────────────────────────────────
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

    if (order.senderEmail) {
      try {
        await sendEmail({
          to: order.senderEmail,
          subject: `Order Update - ${order.orderId}`,
          html: `<h2>Hello ${order.sender},</h2><p>Your order <strong>${order.orderId}</strong> has been updated to: <strong>${orderStatus}</strong>.</p>`,
        });
      } catch (emailErr) {
        console.log("⚠️ Status update email failed:", emailErr.message);
      }
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/complete ─────────────────────────────────
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

    if (order.senderEmail) {
      try {
        await sendEmail({
          to: order.senderEmail,
          subject: `Order Delivered! - ${order.orderId}`,
          html: orderCompletedTemplate(order),
        });
      } catch (emailErr) {
        console.log("⚠️ Completion email failed:", emailErr.message);
      }
    }

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
