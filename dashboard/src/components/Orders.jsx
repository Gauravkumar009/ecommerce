import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../store/slices/orderSlice";
import { LoaderCircle, Trash2 } from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

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

  const statusColors = {
    Processing: "bg-amber-50 text-amber-600 border-amber-200",
    Shipped: "bg-blue-50 text-blue-600 border-blue-200",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-sm text-gray-500">Monitor and update customer orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total Price</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders && orders.length > 0 ? (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">
                          {ord.id?.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">
                            {ord.user_name || ord.user?.name || "Customer"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ord.user_email || ord.user?.email || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
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
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-400"
                      >
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
