import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Category from "../models/category.model.js";

// ── GET /api/analytics/revenue ───────────────────────────────────
// Bar chart data — Orders & Revenue by day/week/month
// Query param: ?range=7days | 30days | 6months (default: 7days)
export const getRevenueChart = async (req, res, next) => {
  try {
    const { range = "7days" } = req.query;

    const now = new Date();
    let startDate;
    let groupFormat;

    if (range === "30days") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      groupFormat = { $dateToString: { format: "%b %d", date: "$createdAt" } };
    } else if (range === "6months") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 6);
      groupFormat = { $dateToString: { format: "%b %Y", date: "$createdAt" } };
    } else {
      // default: last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    }

    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: "Paid" } },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          revenue: 1,
          orders: 1,
        },
      },
    ]);

    // Mark the highest revenue bar as highlighted
    if (revenueData.length > 0) {
      const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
      revenueData.forEach((d) => {
        d.isHighlighted = d.revenue === maxRevenue;
      });
    }

    res.status(200).json({
      success: true,
      range,
      data: revenueData,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/analytics/categories ───────────────────────────────
// Pie chart data — Order distribution by category
export const getCategoryDistribution = async (req, res, next) => {
  try {
    const categoryData = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } }, // ✅ fixed
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } }, // ✅ fixed
      {
        $group: {
          _id: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
          orders: { $sum: 1 },
          value: { $sum: "$items.price" },
        },
      },
      { $sort: { orders: -1 } },
      { $project: { _id: 0, name: "$_id", orders: 1, value: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categoryData,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/analytics/brands ────────────────────────────────────
// Bar chart — Revenue by brand (John's Stores vs Swift Logistics)
// Query param: ?range=7days | 30days | 6months
export const getBrandPerformance = async (req, res, next) => {
  try {
    const { range = "7days" } = req.query;
    const now = new Date();
    let startDate = new Date(now);

    if (range === "30days") startDate.setDate(now.getDate() - 30);
    else if (range === "6months") startDate.setMonth(now.getMonth() - 6);
    else startDate.setDate(now.getDate() - 7);

    const brandData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: "$brand",
          value: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
          orders: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      range,
      data: brandData,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/analytics/summary ───────────────────────────────────
// Full analytics page — all 3 charts + stat cards in one call
// Query param: ?range=7days | 30days | 6months
export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const { range = "7days" } = req.query;
    const now = new Date();
    let startDate = new Date(now);

    if (range === "30days") startDate.setDate(now.getDate() - 30);
    else if (range === "6months") startDate.setMonth(now.getMonth() - 6);
    else startDate.setDate(now.getDate() - 7);

    let groupFormat;
    if (range === "6months") {
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else if (range === "30days") {
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    } else {
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    }

    const [
      revenueData,
      brandData,
      categoryData,
      ordersInRange,
      revenueInRange,
      completedInRange,
      lowStock,
    ] = await Promise.all([
      // Revenue chart
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: "Paid" } },
        {
          $group: {
            _id: groupFormat,
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            name: "$_id",
            revenue: 1,
            orders: 1,
          },
        },
      ]),

      // Brand performance
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: "Paid" } },
        {
          $group: {
            _id: "$brand",
            value: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $project: { _id: 0, name: "$_id", value: 1, orders: 1 } },
      ]),

      // Category distribution
      Order.aggregate([
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } }, // ✅ fixed
        {
          $lookup: {
            from: "categories",
            localField: "productInfo.category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
        }, // ✅ fixed
        {
          $group: {
            _id: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
            orders: { $sum: 1 },
            value: { $sum: "$items.price" },
          },
        },
        { $sort: { orders: -1 } },
        { $project: { _id: 0, name: "$_id", orders: 1, value: 1 } },
      ]),
      // Stats
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({
        createdAt: { $gte: startDate },
        orderStatus: "Completed",
      }),
      Product.countDocuments({ stockQuantity: { $lte: 5 } }),
    ]);

    // Mark highest revenue bar
    if (revenueData.length > 0) {
      const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
      revenueData.forEach((d) => {
        d.isHighlighted = d.revenue === maxRevenue;
      });
    }

    res.status(200).json({
      success: true,
      range,
      data: {
        statsCards: [
          {
            id: "revenue",
            label: "Total Revenue",
            icon: "/naira.svg",
            value: `₦${(revenueInRange[0]?.total || 0).toLocaleString()}`,
          },
          {
            id: "orders",
            label: "Total Orders",
            icon: "/orders.svg",
            value: ordersInRange.toString(),
          },
          {
            id: "completed",
            label: "Completed Orders",
            icon: "/completed.svg",
            value: completedInRange.toString(),
          },
          {
            id: "lowstock",
            label: "Low Stock Items",
            icon: "/completed.svg",
            value: lowStock.toString(),
          },
        ],
        revenueData,
        brandData,
        categoryData,
      },
    });
  } catch (err) {
    next(err);
  }
};
