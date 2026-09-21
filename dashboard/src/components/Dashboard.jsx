import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import { getDashboardStats } from "../store/slices/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#f7f8fc]">
      <Header />
      <main className="max-w-[1440px] w-full mx-auto flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-slate-800">Dashboard</h2>
            <p className="mt-0.5 text-sm text-slate-500">Welcome back, Admin — here&apos;s your store overview</p>
          </div>
          <button onClick={() => dispatch(getDashboardStats())} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
        </div>
        <Stats />
        <MiniSummary />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
          <MonthlySalesChart />
          <OrdersChart />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopProductsChart />
          <TopSellingProducts />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
