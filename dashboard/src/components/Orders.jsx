import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../store/slices/orderSlice";
import { LoaderCircle, Trash2, RefreshCw, Search, Package, Truck } from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus(orderId, newStatus));
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
    }
  };

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const statusCounts = useMemo(() => (orders || []).reduce(
    (counts, order) => ({ ...counts, [order.order_status]: (counts[order.order_status] || 0) + 1 }),
    { All: orders?.length || 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 }
  ), [orders]);
  const visibleOrders = (orders || []).filter((order) => {
    const matchesStatus = activeStatus === "All" || order.order_status === activeStatus;
    const searchable = `${order.id || ""} ${order.shipping_info?.full_name || ""} ${order.user_name || ""}`.toLowerCase();
    return matchesStatus && searchable.includes(search.toLowerCase());
  });

  const statusColors = {
    Processing: "bg-amber-50 text-amber-600 border-amber-200",
    Shipped: "bg-blue-50 text-blue-600 border-blue-200",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f7f8fc] min-w-0">
      <Header />
      <div className="max-w-[1440px] w-full mx-auto p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Orders</h2>
            <p className="mt-1 text-sm text-slate-500">Manage and update all customer orders</p>
          </div>
          <button onClick={() => dispatch(fetchAllOrders())} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => <button key={status} onClick={() => setActiveStatus(status)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${activeStatus === status ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"}`}>
              {status}<span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${activeStatus === status ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{statusCounts[status] || 0}</span>
            </button>)}
          </div>
          <label className="relative block w-full xl:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by Order ID or Customer..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Placed On</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleOrders.length > 0 ? (
                    visibleOrders.map((ord) => {
                      const primaryItem = Array.isArray(ord.order_items) ? ord.order_items[0] : null;
                      const productImage = primaryItem?.image;
                      return (
                      <tr key={ord.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={primaryItem?.title || "Ordered product"}
                              className="h-11 w-11 rounded-lg border border-slate-200 object-cover bg-slate-50"
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">
                            {ord.user_name || ord.user?.name || "Customer"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ord.user_email || ord.user?.email || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5"><Package className="h-4 w-4 text-slate-400" />{Array.isArray(ord.order_items) ? ord.order_items.length : 0} Item{Array.isArray(ord.order_items) && ord.order_items.length !== 1 ? "s" : ""}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          ₹{Number(ord.total_price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              ord.paid_at
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {ord.paid_at ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={ord.order_status}
                            onChange={(e) =>
                              handleStatusChange(ord.id, e.target.value)
                            }
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus:outline-none ${
                              statusColors[ord.order_status] || "border-gray-200"
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{ord.created_at ? new Date(ord.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(ord.id)}
                            className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-gray-400"
                      >
                        No orders match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-sm text-slate-500">Showing {visibleOrders.length} of {orders?.length || 0} orders</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
