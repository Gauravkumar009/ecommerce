import React from "react";
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    newUsersThisMonth,
    currentMonthSales,
    revenueGrowth,
    lowStockProducts,
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{item.title}</p>
              <p className="text-lg font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniSummary;
