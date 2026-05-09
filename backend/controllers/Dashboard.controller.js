import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import EasyMedia from "../models/Easymedia.model.js";
import Notification from "../models/Notification.model.js";

// ── GET /api/dashboard ────────────────────────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const { filter = "Last 30 Days" } = req.query;
    const now = new Date();
    let startDate;

    switch (filter) {
      case "Today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "This Week":
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "This Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "Last 30 Days":
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
    }

    const dateFilter = { createdAt: { $gte: startDate } };

    const [
      totalOrders,
      completedOrders,
      pendingPaymentOrders,
      thisMonthRevenueData,
      lastMonthRevenueData,
      allTimeRevenueData,
      totalProfitData,
      lowStockCount,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(dateFilter),
      Order.countDocuments({ ...dateFilter, orderStatus: "Completed" }),
      Order.countDocuments({ ...dateFilter, paymentStatus: "Pending" }),

      // This month revenue — uses finalPrice if set, otherwise total
      Order.aggregate([
        { $match: { paymentStatus: "Paid", ...dateFilter } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: {
                  if: { $gt: ["$finalPrice", 0] },
                  then: "$finalPrice",
                  else: "$total",
                },
              },
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
              $lte: new Date(now.getFullYear(), now.getMonth(), 0),
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // All time revenue — uses finalPrice if set, otherwise total
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: {
                  if: { $gt: ["$finalPrice", 0] },
                  then: "$finalPrice",
                  else: "$total",
                },
              },
            },
          },
        },
      ]),

      // Total profit
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$profit" } } }]),

      Product.countDocuments({ stockQuantity: { $lte: 5 } }),

      Order.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "orderId brand sender total orderStatus paymentStatus createdAt",
        )
        .lean(),
    ]);

    const thisMonthTotal = thisMonthRevenueData[0]?.total || 0;
    const lastMonthTotal = lastMonthRevenueData[0]?.total || 0;
    const totalRevenue = allTimeRevenueData[0]?.total || 0;
    const totalProfit = totalProfitData[0]?.total || 0;

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

    const lowStockProducts = await Product.find({ stockQuantity: { $lte: 5 } })
      .select("productName stockQuantity brand status")
      .sort({ stockQuantity: 1 })
      .limit(10)
      .lean();

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
          totalProfit: {
            value: `₦${totalProfit.toLocaleString()}`,
            trend: "",
            isPositive: true,
            label: "all time profit",
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
            value: lowStockCount.toString(),
            badge: lowStockCount.toString(),
            isPositive: lowStockCount === 0,
            label: lowStockCount === 0 ? "All good" : "Items low",
            prefix: "",
          },
        },
        recentOrders: formattedRecentOrders,
        lowStockProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/dashboard/reset ─────────────────────────────────────
export const resetDashboard = async (req, res, next) => {
  try {
    await Order.deleteMany({});
    await EasyMedia.deleteMany({});
    await Notification.deleteMany({});
    res.status(200).json({
      success: true,
      message:
        "Dashboard has been reset. All orders, emails, and notifications cleared. Products and categories remain unchanged.",
    });
  } catch (err) {
    next(err);
  }
};
