import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { getAnalyticsSummary } from "../services/api.service.js";

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444"];
const RANGES = ["7days", "30days", "6months"];
const RANGE_LABELS = {
  "7days": "7 Days",
  "30days": "30 Days",
  "6months": "6 Months",
};

const Analytics = () => {
  const [range, setRange] = useState("7days");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await getAnalyticsSummary(range);
      setData(result);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
          <p className="text-[#717182] font-dm-sans-500 text-sm">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col justify-center items-start w-full p-3 lg:p-[12px] gap-[15px] rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-[15px] w-full">
          {(data?.statsCards || []).map((card, index) => (
            <div
              key={index}
              className="flex justify-center items-center w-full p-3 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-[#FAFAFA]"
            >
              <div className="flex w-full flex-col items-start shrink-0 gap-[15px]">
                <div className="flex items-center gap-[10px]">
                  <img src={card.icon} alt="" />
                  <p className="text-[#717182] text-center font-medium text-[10px] lg:text-xs leading-[16px] font-clash-grotesk">
                    {card.label}
                  </p>
                </div>
                <div className="flex items-center self-stretch pl-[12px] py-[15px] rounded-[10px] border border-[rgba(107,107,107,0.10)] bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.05)]">
                  <p className="text-[#3B0002] font-medium text-[16px] lg:text-[22px] leading-[28px] font-clash-grotesk">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="flex justify-center items-center p-3 lg:p-[15px] rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white w-full">
          <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
            {/* Revenue Bar Chart */}
            <div className="w-full lg:w-[561px] h-[400px] lg:h-[494px] px-3 lg:px-4 pt-5 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white">
              <div className="flex w-full justify-between items-center mb-4 flex-wrap gap-2">
                <p className="text-[#2D2D2D] font-medium text-sm lg:text-base leading-[18px] tracking-[-0.2px] font-clash-grotesk">
                  Orders & Revenue
                </p>
                <div className="flex gap-1">
                  {RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-2 lg:px-3 py-1 rounded-[8px] text-[10px] lg:text-xs font-dm-sans-500 cursor-pointer transition-colors ${range === r ? "bg-[#032817] text-white" : "bg-[#F3F4F6] text-[#717182]"}`}
                    >
                      {RANGE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data?.revenueData || []}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                    {(data?.revenueData || []).map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.isHighlighted ? "#E3494E" : "#E5E7EB"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie Chart */}
            <div className="w-full lg:w-[361px] h-[400px] lg:h-[494px] px-3 lg:px-4 pt-5 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white">
              <p className="text-[#2D2D2D] font-medium text-sm lg:text-base leading-[18px] tracking-[-0.2px] font-clash-grotesk mb-4">
                Category Distribution
              </p>
              {(data?.categoryData || []).length === 0 ? (
                <div className="flex justify-center items-center h-[300px]">
                  <p className="text-[#717182] text-sm font-dm-sans-500">
                    No data yet
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={data?.categoryData || []}
                        dataKey="value"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {(data?.categoryData || []).map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col w-full gap-2">
                    {(data?.categoryData || []).map((item, index) => (
                      <div key={index} className="flex w-full justify-between">
                        <div className="flex gap-1.5 items-center">
                          <div
                            className="w-[15px] h-[15px] shrink-0 rounded-[4px]"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <p className="text-[#0A0A0A] font-medium text-[10px] lg:text-xs leading-[20px] font-clash-grotesk">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[#0A0A0A] font-medium text-[10px] lg:text-xs leading-[20px] font-dm-sans">
                          {item.orders} Orders
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Performance */}
      <div className="flex justify-center items-center w-full p-3 lg:p-[15px] rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="flex justify-center items-center w-full p-4 lg:p-[25px] shrink-0 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white">
          <div className="flex flex-col w-full items-start gap-6">
            <div className="flex w-full justify-between items-center">
              <p className="text-[#2D2D2D] font-medium text-sm lg:text-base leading-[18px] tracking-[-0.2px] font-clash-grotesk">
                Brand Performance
              </p>
              <p className="text-[#717182] font-semibold text-xs lg:text-sm leading-[18px] tracking-[-0.5px] font-dm-sans-700">
                {RANGE_LABELS[range]}
              </p>
            </div>
            {(data?.brandData || []).length === 0 ? (
              <div className="flex justify-center items-center w-full h-[200px]">
                <p className="text-[#717182] text-sm font-dm-sans-500">
                  No brand data yet
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data?.brandData || []}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[20, 20, 0, 0]}>
                    {(data?.brandData || []).map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === 0
                            ? "url(#orangeGradient)"
                            : "url(#greenGradient)"
                        }
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient
                      id="orangeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                    <linearGradient
                      id="greenGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
