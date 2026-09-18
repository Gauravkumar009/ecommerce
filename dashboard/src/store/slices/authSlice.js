import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
    },
    loginFailed(state) {
      state.loading = false;
      state.isCheckingAuth = false;
    },
    getUserRequest(state) {
      state.isCheckingAuth = true;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
    logoutFailed(state) {
      state.loading = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
    },
    forgotPasswordSuccess(state) {
      state.loading = false;
    },
    forgotPasswordFailed(state) {
      state.loading = false;
    },
    resetPasswordRequest(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state) {
      state.loading = false;
    },
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailed(state) {
      state.loading = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
    },
    updatePasswordFailed(state) {
      state.loading = false;
    },
    resetAuthSlice(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
  },
});

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    await axiosInstance.post("/auth/login", data).then((res) => {
      if (res.data.user.role === "Admin") {
        dispatch(authSlice.actions.loginSuccess(res.data.user));
        toast.success(res.data.message);
      } else {
        dispatch(authSlice.actions.loginFailed());
        toast.error("Access denied. Admin role required.");
      }
    });
  } catch (error) {
    dispatch(authSlice.actions.loginFailed());
    toast.error(error.response?.data?.message || "Login Failed");
  }
};
export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const res = await axiosInstance.get("/auth/me");
    if (res.data.user && res.data.user.role === "Admin") {
      dispatch(authSlice.actions.getUserSuccess(res.data.user));
    } else {
      dispatch(authSlice.actions.getUserFailed());
    }
  } catch {
    dispatch(authSlice.actions.getUserFailed());
  }
};
export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const res = await axiosInstance.get("/auth/logout");
    dispatch(authSlice.actions.logoutSuccess());
    toast.success(res.data.message);
    dispatch(authSlice.actions.resetAuthSlice());
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed());
    toast.error(error.response?.data?.message || "Logout Failed");
    dispatch(authSlice.actions.resetAuthSlice());
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    const res = await axiosInstance.post(
      "/auth/password/forgot?frontend_URL=http://localhost:5174",
      email
    );
    dispatch(authSlice.actions.forgotPasswordSuccess());
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.forgotPasswordFailed());
    toast.error(
      error.response?.data?.message || "Cannot request for reset Password"
    );
  }
};

export const resetPassword = (newData, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  try {
    const res = await axiosInstance.put(
      `/auth/password/reset/${token}`,
      newData
    );
    dispatch(authSlice.actions.resetPasswordSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFailed());
    toast.error(error.response?.data?.message || "Failed to reset Password");
  }
};

export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updateProfileRequest());
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    dispatch(authSlice.actions.updateProfileSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.updateProfileFailed());
    toast.error(error.response?.data?.message || "Failed to update Profile");
  }
};

export const updateAdminPassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    await axiosInstance
      .put("/auth/password/update", data)
      .then(res => {
        dispatch(authSlice.actions.updatePasswordSuccess());
        toast.success(res.data.message);
      });
  } catch (error) {
    dispatch(authSlice.actions.updatePasswordFailed());
    toast.error(error.response.data.message || "Failed to update Password.");
  }
};

export const resetAuthSlice =() => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
}

export default authSlice.reducer;
