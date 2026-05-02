import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/api.service.js";

const dateFilterOptions = ["Today", "This Week", "This Month", "Last 30 Days"];

// ── Stat Card ────────────────────────────────────────────────────
const StatCard = ({ stat }) => (
  <div className="flex justify-center items-center w-full p-[12px] rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-[#FAFAFA]">
    <div className="flex w-full flex-col items-start shrink-0 gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img src={stat.icon} alt={stat.label} />
        <p className="text-[#717182] font-medium text-xs leading-[16px] font-clash-grotesk">
          {stat.label}
        </p>
      </div>
      <div className="flex items-center self-stretch pl-[12px] py-[15px] rounded-[10px] border border-[rgba(107,107,107,0.10)] bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-2">
          <p className="text-[#3B0002] font-medium text-[22px] leading-[28px] font-clash-grotesk">
            {stat.value}
          </p>
          <span className="text-[#6B6B6B] font-medium text-[9px] leading-[12px] tracking-[-0.3px] font-dm-sans-500">
            {stat.badgePrefix && `${stat.badgePrefix} `}
            <span
              className={`${stat.isPositive ? "text-[#1FB35B]" : "text-[#C3383F]"} font-medium`}
            >
              {stat.badge}
            </span>
            {stat.badgeSuffix && ` ${stat.badgeSuffix}`}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ── Order Row ────────────────────────────────────────────────────
const OrderRow = ({ order, onView }) => (
  <div className="flex items-center w-full px-[25px] border-b border-[rgba(107,107,107,0.15)] h-[52px]">
    <div className="flex-1 min-w-0">
      <p className="text-[#2D2D2D] font-medium text-[13px] leading-[14px] font-clash-grotesk truncate">
        {order.orderId}
      </p>
    </div>
    <div className="flex-1 flex gap-1 items-center min-w-0">
      <img
        src={order.brandIcon}
        alt={order.brand}
        className="shrink-0 w-4 h-4"
      />
      <p className="text-[#2D2D2D] font-medium text-[13px] leading-[14px] tracking-[-0.5px] font-dm-sans-500 truncate">
        {order.brand}
      </p>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[#2D2D2D] font-medium text-[13px] leading-[14px] tracking-[-0.5px] font-dm-sans-500 truncate">
        {order.customerName}
      </p>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[#3B0002] font-medium text-[13px] leading-[14px] font-clash-grotesk truncate">
        {order.total}
      </p>
    </div>
    <div className="flex-1 min-w-0">
      <div
        className={`inline-flex justify-center items-center px-3 h-[24px] rounded-[4px] ${order.statusColor}`}
      >
        <p className="text-[#2D2D2D] font-medium text-[12px] leading-[14px] tracking-[-0.5px] font-dm-sans-500">
          {order.status}
        </p>
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[#3B0002] font-medium text-[13px] leading-[14px] font-clash-grotesk truncate">
        {order.date}
      </p>
    </div>
    <div className="flex-1 min-w-0">
      <button
        onClick={() => onView?.(order)}
        className="text-[#E3494E] font-bold text-[13px] leading-[14px] tracking-[-0.5px] underline font-dm-sans-700 cursor-pointer"
      >
        View
      </button>
    </div>
  </div>
);

// ── Main Dashboard ───────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Last 30 Days");
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();

      // ── Map stats from API to StatCard format ──────────────────
      const s = data.stats;
      setStats([
        {
          id: "revenue",
          label: "Total Revenue",
          icon: "/naira.svg",
          value: s.totalRevenue.value,
          badge: s.totalRevenue.trend,
          isPositive: s.totalRevenue.isPositive,
          badgeSuffix: s.totalRevenue.label,
        },
        {
          id: "orders",
          label: "Total Orders",
          icon: "/orders.svg",
          value: s.totalOrders.value,
          badge: s.totalOrders.trend,
          isPositive: true,
          badgeSuffix: s.totalOrders.label,
        },
        {
          id: "pending",
          label: "Pending Payments",
          icon: "/pending.svg",
          value: s.pendingPayments.value,
          badge: s.pendingPayments.badge,
          isPositive: false,
        },
        {
          id: "completed",
          label: "Completed Orders",
          icon: "/completed.svg",
          value: s.completedOrders.value,
          badge: s.completedOrders.badge,
          isPositive: true,
        },
        {
          id: "lowstock",
          label: "Low Stock Items",
          icon: "/completed.svg",
          value: s.lowStockItems.value,
          badge: s.lowStockItems.badge,
          isPositive: false,
          badgeSuffix: s.lowStockItems.label,
          badgePrefix: s.lowStockItems.prefix,
        },
      ]);

      setRecentOrders(data.recentOrders);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    navigate(`/orders?orderId=${order.orderId}`);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setFilterOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
          <p className="text-[#717182] font-dm-sans-500 text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-center items-start w-full p-[12px] gap-[20px] rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        {/* ── STAT CARDS ────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-[20px] w-full">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* ── RECENT ORDERS TABLE ───────────────────────────────── */}
        <div className="w-full h-auto pt-[24px] rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white">
          <div className="flex items-center w-full px-[25px] justify-between mb-2">
            <p className="text-[#2D2D2D] font-medium text-[18px] leading-base tracking-[-0.2px] font-clash-grotesk">
              Recent Orders
            </p>

            {/* Date Filter */}
            <div className="relative">
              <div
                className="flex gap-1 items-center justify-center cursor-pointer"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <img src="/calendar.svg" alt="" />
                <p className="text-[#717182] font-semibold text-sm leading-[18px] tracking-[-0.5px] font-dm-sans-700">
                  {selectedFilter}
                </p>
                <div className="flex flex-col gap-0.5">
                  <img src="/up-arrow.svg" alt="" />
                  <img src="/down-arrow.svg" alt="" />
                </div>
              </div>
              {filterOpen && (
                <div className="absolute top-full right-1 mt-2 w-[135px] bg-white shadow-md rounded-[10px] z-10">
                  {dateFilterOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleFilterSelect(option)}
                      className={`flex items-center self-stretch pl-[16px] py-[10px] border-b border-[#DADADA] cursor-pointer hover:bg-gray-50 rounded-[10px] ${selectedFilter === option ? "bg-[#E6D3AC]" : ""}`}
                    >
                      <p className="text-[#717182] font-semibold text-sm leading-[18px] tracking-[-0.5px] font-dm-sans-700">
                        {option}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <div className="flex items-center w-full px-[25px] py-[10px] bg-[#FAFAFA]">
              {[
                "Order ID",
                "Brand",
                "Customer's Name",
                "Total",
                "Status",
                "Date",
                "Action",
              ].map((col) => (
                <div key={col} className="flex-1 h-[44px] flex items-center">
                  <p className="text-[#717182] font-bold text-[13px] leading-[14px] font-clash-grotesk">
                    {col}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                  />
                ))
              ) : (
                <div className="flex justify-center py-10">
                  <p className="text-[#717182] font-dm-sans-500 text-sm">
                    No recent orders
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
