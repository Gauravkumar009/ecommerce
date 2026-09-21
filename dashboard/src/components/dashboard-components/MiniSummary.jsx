import React from "react";
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  Users,
  Award,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    newUsersThisMonth,
    currentMonthSales,
    revenueGrowth,
    lowStockProducts,
    totalUsersCount,
    topSellingProducts,
  } = useSelector((state) => state.admin);

  const lowStockCount = Array.isArray(lowStockProducts)
    ? lowStockProducts.length
    : lowStockProducts || 0;

  const items = [
    {
      title: "Current Month Sales",
      value: `₹${formatNumber(currentMonthSales || 0)}`,
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Revenue Growth",
      value: revenueGrowth || "0%",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "New Users This Month",
      value: formatNumber(newUsersThisMonth || 0),
      icon: UserPlus,
      color: "text-sky-600 bg-sky-50",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  const referenceItems = [
    { title: "Registered Customers", value: formatNumber(totalUsersCount || 0), subtitle: "Total registered users", icon: Users, color: "text-sky-600 bg-sky-50" },
    { title: "New Users This Month", value: `+${formatNumber(newUsersThisMonth || 0)}`, subtitle: "Recent sign-ups", icon: UserPlus, color: "text-violet-600 bg-violet-50" },
    { title: "Low Stock Alert", value: lowStockCount, subtitle: "Products with stock ≤ 5", icon: AlertTriangle, color: "text-amber-500 bg-amber-50" },
    { title: "Top Products Tracked", value: topSellingProducts?.length || 0, subtitle: "Best sellers ranked", icon: Award, color: "text-rose-500 bg-rose-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {referenceItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="min-h-[136px] bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="max-w-[120px] text-xs font-bold uppercase tracking-wide text-slate-400">{item.title}</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{item.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniSummary;
