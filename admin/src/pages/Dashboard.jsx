import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/api.service.js";

const dateFilterOptions = ["Today", "This Week", "This Month", "Last 30 Days"];

const StatCard = ({ stat }) => (
  <div className="flex justify-center items-center w-full p-2.5 lg:p-[12px] rounded-[14px] lg:rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-[#FAFAFA]">
    <div className="flex w-full flex-col items-start shrink-0 gap-[10px] lg:gap-[15px]">
      <div className="flex items-center gap-[6px] lg:gap-[10px]">
        <img
          src={stat.icon}
          alt={stat.label}
          className="w-4 h-4 lg:w-auto lg:h-auto"
        />
        <p className="text-[#717182] font-medium text-[10px] lg:text-xs leading-[16px] font-clash-grotesk">
          {stat.label}
        </p>
      </div>
      <div className="flex items-center self-stretch pl-[8px] lg:pl-[12px] py-[10px] lg:py-[15px] rounded-[8px] lg:rounded-[10px] border border-[rgba(107,107,107,0.10)] bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1 lg:gap-2">
          <p className="text-[#3B0002] font-medium text-sm lg:text-[22px] leading-[28px] font-clash-grotesk">
            {stat.value}
          </p>
          <span className="text-[#6B6B6B] font-medium text-[8px] lg:text-[9px] leading-[12px] tracking-[-0.3px] font-dm-sans-500">
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

const COLS = [
  { label: "Order ID", width: "w-[110px]" },
  { label: "Brand", width: "w-[130px]" },
  { label: "Customer's Name", width: "w-[130px]" },
  { label: "Total", width: "w-[100px]" },
  { label: "Status", width: "w-[110px]" },
  { label: "Date", width: "w-[120px]" },
  { label: "Action", width: "w-[70px]" },
];

const OrderRow = ({ order, onView }) => (
  <div className="flex items-center w-full px-[16px] border-b border-[rgba(107,107,107,0.15)] h-[52px] gap-[12px]">
    <div className={`${COLS[0].width} shrink-0`}>
      <p className="text-[#2D2D2D] font-medium text-[12px] leading-[14px] font-clash-grotesk truncate">
        {order.orderId}
      </p>
    </div>
    <div className={`${COLS[1].width} shrink-0 flex gap-1 items-center`}>
      <img
        src={order.brandIcon}
        alt={order.brand}
        className="shrink-0 w-4 h-4"
      />
      <p className="text-[#2D2D2D] font-medium text-[12px] leading-[14px] tracking-[-0.5px] font-dm-sans-500 truncate">
        {order.brand}
      </p>
    </div>
    <div className={`${COLS[2].width} shrink-0`}>
      <p className="text-[#2D2D2D] font-medium text-[12px] leading-[14px] tracking-[-0.5px] font-dm-sans-500 truncate">
        {order.customerName}
      </p>
    </div>
    <div className={`${COLS[3].width} shrink-0`}>
      <p className="text-[#3B0002] font-medium text-[12px] leading-[14px] font-clash-grotesk truncate">
        {order.total}
      </p>
    </div>
    <div className={`${COLS[4].width} shrink-0`}>
      <div
        className={`inline-flex justify-center items-center px-2 h-[24px] rounded-[4px] ${order.statusColor}`}
      >
        <p className="text-[#2D2D2D] font-medium text-[11px] leading-[14px] tracking-[-0.5px] font-dm-sans-500 whitespace-nowrap">
          {order.status}
        </p>
      </div>
    </div>
    <div className={`${COLS[5].width} shrink-0`}>
      <p className="text-[#3B0002] font-medium text-[12px] leading-[14px] font-clash-grotesk truncate">
        {order.date}
      </p>
    </div>
    <div className={`${COLS[6].width} shrink-0`}>
      <button
        onClick={() => onView?.(order)}
        className="text-[#E3494E] font-bold text-[12px] leading-[14px] tracking-[-0.5px] underline font-dm-sans-700 cursor-pointer whitespace-nowrap"
      >
        View
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Last 30 Days");
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async (filter) => {
    setLoading(true);
    try {
      const data = await getDashboardStats(filter || selectedFilter);
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

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleViewOrder = (order) =>
    navigate(`/orders?orderId=${order.orderId}`);

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setFilterOpen(false);
    loadDashboard(option);
  };

  const TABLE_MIN_W = "min-w-[780px]";

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
      <div className="flex flex-col justify-center items-start w-full p-2.5 lg:p-[12px] gap-[15px] lg:gap-[20px] rounded-[20px] lg:rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-[20px] w-full">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <div className="w-full rounded-[14px] lg:rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white overflow-hidden">
          <div className="flex items-center w-full px-3 lg:px-[25px] pt-[16px] lg:pt-[24px] pb-3 justify-between">
            <p className="text-[#2D2D2D] font-medium text-sm lg:text-[18px] leading-base tracking-[-0.2px] font-clash-grotesk">
              Recent Orders
            </p>
            <div className="relative">
              <div
                className="flex gap-1 items-center justify-center cursor-pointer"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <img
                  src="/calendar.svg"
                  alt=""
                  className="w-3.5 h-3.5 lg:w-auto lg:h-auto"
                />
                <p className="text-[#717182] font-semibold text-[10px] lg:text-sm leading-[18px] tracking-[-0.5px] font-dm-sans-700">
                  {selectedFilter}
                </p>
                <div className="flex flex-col gap-0.5">
                  <img src="/up-arrow.svg" alt="" />
                  <img src="/down-arrow.svg" alt="" />
                </div>
              </div>
              {filterOpen && (
                <div className="absolute top-full right-0 mt-2 w-[135px] bg-white shadow-md rounded-[10px] z-10">
                  {dateFilterOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleFilterSelect(option)}
                      className={`flex items-center pl-[16px] py-[10px] border-b border-[#DADADA] cursor-pointer hover:bg-gray-50 rounded-[10px] ${selectedFilter === option ? "bg-[#E6D3AC]" : ""}`}
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

          <div className="w-full overflow-x-auto">
            <div
              className={`flex items-center ${TABLE_MIN_W} px-[16px] py-[10px] gap-[12px] bg-[#FAFAFA]`}
            >
              {COLS.map((col) => (
                <div key={col.label} className={`${col.width} shrink-0`}>
                  <p className="text-[#717182] font-bold text-[12px] leading-[14px] font-clash-grotesk">
                    {col.label}
                  </p>
                </div>
              ))}
            </div>
            <div className={`flex flex-col ${TABLE_MIN_W}`}>
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
