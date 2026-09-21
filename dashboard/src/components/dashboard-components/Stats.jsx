import React from "react";
import { formatNumber } from "../../lib/helper";
import { useSelector } from "react-redux";
import { DollarSign, CalendarDays, Calendar, TrendingUp } from "lucide-react";

const Stats = () => {
  const {
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    currentMonthSales,
  } = useSelector((state) => state.admin);

  const stats = [
    {
      title: "Total Revenue (All Time)",
      value: `₹${formatNumber(totalRevenueAllTime || 0)}`,
      icon: DollarSign,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Today's Revenue",
      value: `₹${formatNumber(todayRevenue || 0)}`,
      icon: Calendar,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Yesterday's Revenue",
      value: `₹${formatNumber(yesterdayRevenue || 0)}`,
      icon: CalendarDays,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Current Month Sales",
      value: `INR ${formatNumber(currentMonthSales || 0)}`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="min-h-[126px] bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
          >
            <div>
              <p className="max-w-[130px] text-xs font-bold text-slate-500 uppercase tracking-wide">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-4">
                {item.value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
