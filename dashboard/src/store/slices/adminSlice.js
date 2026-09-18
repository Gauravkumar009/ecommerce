import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    totalUsers: 0,
    users: [],
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    totalUsersCount: 0,
    monthlySales: [],
    orderStatusCounts: {},
    topSellingProducts: [],
    lowStockProducts: [],
    revenueGrowth: "0%",
    newUsersThisMonth: 0,
    currentMonthSales: 0,
  },
  reducers: {
    adminRequest(state) {
      state.loading = true;
    },
    adminSuccess(state) {
      state.loading = false;
    },
    adminFailed(state) {
      state.loading = false;
    },
    setDashboardStats(state, action) {
      const data = action.payload;
      state.totalRevenueAllTime = data.totalRevenueAllTime || 0;
      state.todayRevenue = data.todayRevenue || 0;
      state.yesterdayRevenue = data.yesterdayRevenue || 0;
      state.totalUsersCount = data.totalUsersCount || 0;
      state.monthlySales = data.monthlySales || [];
      state.orderStatusCounts = data.orderStatusCounts || {};
      state.topSellingProducts = data.topSellingProducts || [];
      state.lowStockProducts = data.lowStockProducts || [];
      state.revenueGrowth = data.revenueGrowth || "0%";
      state.newUsersThisMonth = data.newUsersThisMonth || 0;
      state.currentMonthSales = data.currentMonthSales || 0;
    },
    setUsers(state, action) {
      state.users = action.payload.users || [];
      state.totalUsers = action.payload.totalUsers || 0;
    },
    removeUser(state, action) {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.totalUsers = Math.max(0, state.totalUsers - 1);
    },
  },
});

export const getDashboardStats = () => async (dispatch) => {
  dispatch(adminSlice.actions.adminRequest());
  try {
    const res = await axiosInstance.get("/admin/fetch/dashboard-stats");
    dispatch(adminSlice.actions.setDashboardStats(res.data));
    dispatch(adminSlice.actions.adminSuccess());
  } catch (error) {
    dispatch(adminSlice.actions.adminFailed());
  }
};

export const getAllUsers = (page = 1) => async (dispatch) => {
  dispatch(adminSlice.actions.adminRequest());
  try {
    const res = await axiosInstance.get(`/admin/getallusers?page=${page}`);
    dispatch(adminSlice.actions.setUsers(res.data));
    dispatch(adminSlice.actions.adminSuccess());
  } catch (error) {
    dispatch(adminSlice.actions.adminFailed());
  }
};

export const deleteUser = (id) => async (dispatch) => {
  dispatch(adminSlice.actions.adminRequest());
  try {
    const res = await axiosInstance.delete(`/admin/delete/${id}`);
    dispatch(adminSlice.actions.removeUser(id));
    dispatch(adminSlice.actions.adminSuccess());
    toast.success(res.data.message || "User deleted successfully");
  } catch (error) {
    dispatch(adminSlice.actions.adminFailed());
    toast.error(error.response?.data?.message || "Failed to delete user");
  }
};

export const {
  adminRequest,
  adminSuccess,
  adminFailed,
  setDashboardStats,
  setUsers,
  removeUser,
} = adminSlice.actions;

export default adminSlice.reducer;
