import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    totalOrders: 0,
    error: null,
  },
  reducers: {
    orderRequest(state) {
      state.loading = true;
    },
    orderSuccess(state) {
      state.loading = false;
    },
    orderFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setOrders(state, action) {
      state.orders = action.payload.orders || action.payload || [];
      state.totalOrders = action.payload.totalOrders || (action.payload.orders ? action.payload.orders.length : 0);
    },
    updateOrderStatusSuccess(state, action) {
      state.orders = state.orders.map((ord) =>
        ord.id === action.payload.id ? action.payload : ord
      );
    },
    removeOrderSuccess(state, action) {
      state.orders = state.orders.filter((ord) => ord.id !== action.payload);
      state.totalOrders = Math.max(0, state.totalOrders - 1);
    },
  },
});

export const fetchAllOrders = () => async (dispatch) => {
  dispatch(orderSlice.actions.orderRequest());
  try {
    const res = await axiosInstance.get("/order/admin/getall");
    dispatch(orderSlice.actions.setOrders(res.data));
    dispatch(orderSlice.actions.orderSuccess());
  } catch (error) {
    dispatch(orderSlice.actions.orderFailed(error.response?.data?.message || "Failed to fetch orders"));
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  dispatch(orderSlice.actions.orderRequest());
  try {
    const res = await axiosInstance.put(`/order/admin/update/${orderId}`, { status });
    dispatch(orderSlice.actions.updateOrderStatusSuccess(res.data.order || { id: orderId, order_status: status }));
    dispatch(orderSlice.actions.orderSuccess());
    toast.success(res.data.message || "Order status updated");
  } catch (error) {
    dispatch(orderSlice.actions.orderFailed(error.response?.data?.message || "Failed to update order status"));
    toast.error(error.response?.data?.message || "Failed to update order status");
  }
};

export const deleteOrder = (orderId) => async (dispatch) => {
  dispatch(orderSlice.actions.orderRequest());
  try {
    const res = await axiosInstance.delete(`/order/admin/delete/${orderId}`);
    dispatch(orderSlice.actions.removeOrderSuccess(orderId));
    dispatch(orderSlice.actions.orderSuccess());
    toast.success(res.data.message || "Order deleted successfully");
  } catch (error) {
    dispatch(orderSlice.actions.orderFailed(error.response?.data?.message || "Failed to delete order"));
    toast.error(error.response?.data?.message || "Failed to delete order");
  }
};

export const {
  orderRequest,
  orderSuccess,
  orderFailed,
  setOrders,
  updateOrderStatusSuccess,
  removeOrderSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;
