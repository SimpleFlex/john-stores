import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// ── GET /api/analytics/dashboard ────────────────────────────────
// Returns all stat cards + recent orders for the Dashboard page
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // ── Run all queries in parallel for speed ───────────────────
    const [
      totalOrders,
      completedOrders,
      pendingPaymentOrders,
      thisMonthRevenue,
      lastMonthRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments(),

      // Completed orders count
      Order.countDocuments({ orderStatus: "Completed" }),

      // Pending payment count
      Order.countDocuments({ paymentStatus: "Pending" }),

      // This month revenue (paid orders only)
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: startOfThisMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Last month revenue (paid orders only)
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Low stock products (stock <= 5)
      Product.countDocuments({ stockQuantity: { $lte: 5 } }),

      // Recent 5 orders for the table
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "orderId brand brandIcon sender total orderStatus paymentStatus createdAt",
        )
        .lean(),
    ]);

    // ── Calculate revenue trend ──────────────────────────────────
    const thisMonthTotal = thisMonthRevenue[0]?.total || 0;
    const lastMonthTotal = lastMonthRevenue[0]?.total || 0;

    let revenueTrend = "0.0";
    let revenueIsPositive = true;

    if (lastMonthTotal > 0) {
      const diff = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      revenueIsPositive = diff >= 0;
      revenueTrend = `${revenueIsPositive ? "+" : ""}${diff.toFixed(1)}%`;
    }

    // ── Total all-time revenue ───────────────────────────────────
    const allTimeRevenue = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = allTimeRevenue[0]?.total || 0;

    // ── Format recent orders for the frontend ────────────────────
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order._id,
      orderId: order.orderId,
      brand: order.brand,
      brandIcon:
        order.brand === "John's Stores" ? "/john-stores.svg" : "/swift-log.svg",
      customerName: order.sender,
      total: `₦${order.total?.toLocaleString()}`,
      status: order.orderStatus,
      statusColor:
        order.orderStatus === "Completed"
          ? "bg-[#DCFCE7]"
          : order.orderStatus === "Processing"
            ? "bg-[rgba(230,211,172,0.45)]"
            : "bg-[#F2EEC1]",
      date: new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue: {
            value: `₦${totalRevenue.toLocaleString()}`,
            trend: revenueTrend,
            isPositive: revenueIsPositive,
            label: "vs last month",
          },
          totalOrders: {
            value: totalOrders.toString(),
            trend: "-",
            label: "total orders",
          },
          pendingPayments: {
            value: pendingPaymentOrders.toString(),
            badge: "Pending",
            isPositive: false,
          },
          completedOrders: {
            value: completedOrders.toString(),
            badge: "Cleared",
            isPositive: true,
          },
          lowStockItems: {
            value: lowStockProducts.toString(),
            badge: lowStockProducts.toString(),
            isPositive: false,
            label: "Categories",
            prefix: "From",
          },
        },
        recentOrders: formattedRecentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};
