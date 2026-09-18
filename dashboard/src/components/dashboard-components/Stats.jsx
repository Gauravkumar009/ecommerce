import React from "react";
import { formatNumber } from "../../lib/helper";
import { useSelector } from "react-redux";
import { DollarSign, Calendar, Clock, Users } from "lucide-react";

const Stats = () => {
  const {
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
  } = useSelector((state) => state.admin);

  const stats = [
    {
      title: "Total Revenue",
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
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Customers",
      value: formatNumber(totalUsersCount || 0),
      icon: Users,
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
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {item.value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${item.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
