import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

// ── GET /api/dashboard ────────────────────────────────────────────
// Returns all stat cards + recent orders for the Dashboard page
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // ── Run all queries in parallel ──────────────────────────────
    const [
      totalOrders,
      completedOrders,
      pendingPaymentOrders,
      thisMonthRevenueData,
      lastMonthRevenueData,
      allTimeRevenueData,
      lowStockCount,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments(),

      // Completed orders
      Order.countDocuments({ orderStatus: "Completed" }),

      // Pending payment
      Order.countDocuments({ paymentStatus: "Pending" }),

      // This month revenue
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: startOfThisMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Last month revenue
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: {
              $gte: startOfLastMonth,
              $lte: endOfLastMonth,
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // All time revenue
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // ── Low stock: products with stockQuantity <= 5 ──────────────
      // This runs fresh on every request so it always reflects
      // the current stock level in the database
      Product.countDocuments({
        stockQuantity: { $lte: 5 },
        // Only count active/existing products
      }),

      // Recent 5 orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "orderId brand sender total orderStatus paymentStatus createdAt",
        )
        .lean(),
    ]);

    // ── Revenue trend calculation ────────────────────────────────
    const thisMonthTotal = thisMonthRevenueData[0]?.total || 0;
    const lastMonthTotal = lastMonthRevenueData[0]?.total || 0;
    const totalRevenue = allTimeRevenueData[0]?.total || 0;

    let revenueTrend = "0.0%";
    let revenueIsPositive = true;

    if (lastMonthTotal > 0) {
      const diff = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      revenueIsPositive = diff >= 0;
      revenueTrend = `${revenueIsPositive ? "+" : ""}${diff.toFixed(1)}%`;
    } else if (thisMonthTotal > 0) {
      revenueTrend = "+100%";
      revenueIsPositive = true;
    }

    // ── Also get the actual low stock products list ──────────────
    // So admin can see WHICH products are low
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: 5 },
    })
      .select("productName stockQuantity brand status")
      .sort({ stockQuantity: 1 }) // lowest stock first
      .limit(10)
      .lean();

    // ── Format recent orders ─────────────────────────────────────
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order._id,
      orderId: order.orderId,
      brand: order.brand,
      brandIcon:
        order.brand === "John's Stores" ? "/john-stores.svg" : "/swift-log.svg",
      customerName: order.sender,
      total: `₦${order.total?.toLocaleString() || 0}`,
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
            trend: totalOrders > 0 ? `${totalOrders} total` : "0 total",
            label: "total orders",
          },
          pendingPayments: {
            value: pendingPaymentOrders.toString(),
            badge: pendingPaymentOrders > 0 ? "Pending" : "Clear",
            isPositive: pendingPaymentOrders === 0,
          },
          completedOrders: {
            value: completedOrders.toString(),
            badge: "Cleared",
            isPositive: true,
          },
          lowStockItems: {
            // ── This is always fresh from DB ─────────────────────
            value: lowStockCount.toString(),
            badge: lowStockCount.toString(),
            isPositive: lowStockCount === 0,
            label: lowStockCount === 0 ? "All good" : "Items low",
            prefix: lowStockCount > 0 ? "" : "",
          },
        },
        recentOrders: formattedRecentOrders,
        // ── Bonus: send the actual low stock product details ──────
        lowStockProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};
