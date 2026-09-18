import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
} from "./extraSlice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    totalProducts: 0,
  },
  reducers: {
    productRequest(state) {
      state.loading = true;
    },
    productSuccess(state) {
      state.loading = false;
    },
    productFailed(state) {
      state.loading = false;
    },
    setProducts(state, action) {
      state.products = action.payload.products || [];
      state.totalProducts = action.payload.totalProducts || 0;
    },
    addProduct(state, action) {
      state.products.unshift(action.payload);
      state.totalProducts += 1;
    },
    updateProductInList(state, action) {
      state.products = state.products.map((p) =>
        p.id === action.payload.id ? action.payload : p
      );
    },
    removeProductFromList(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.totalProducts -= 1;
    },
  },
});

export const createNewProduct = (data) => async (dispatch) => {
  dispatch(productSlice.actions.productRequest());
  try {
    const res = await axiosInstance.post("/product/admin/create", data);
    dispatch(productSlice.actions.addProduct(res.data.product));
    dispatch(productSlice.actions.productSuccess());
    toast.success(res.data.message || "Product created successfully.");
    dispatch(toggleCreateProductModal());
  } catch (error) {
    dispatch(productSlice.actions.productFailed());
    toast.error(error.response?.data?.message || "Failed to create product");
  }
};

export const updateProduct = (data, productId) => async (dispatch) => {
  dispatch(productSlice.actions.productRequest());
  try {
    const res = await axiosInstance.put(
      `/product/admin/update/${productId}`,
      data
    );
    dispatch(
      productSlice.actions.updateProductInList(
        res.data.updatedProduct || res.data.product
      )
    );
    dispatch(productSlice.actions.productSuccess());
    toast.success(res.data.message || "Product updated successfully.");
    dispatch(toggleUpdateProductModal());
  } catch (error) {
    dispatch(productSlice.actions.productFailed());
    toast.error(error.response?.data?.message || "Failed to update product");
  }
};

export const fetchAllProducts = (params = "") => async (dispatch) => {
  dispatch(productSlice.actions.productRequest());
  try {
    const res = await axiosInstance.get(
      `/product${params ? `?${params}` : ""}`
    );
    dispatch(productSlice.actions.setProducts(res.data));
    dispatch(productSlice.actions.productSuccess());
  } catch (error) {
    dispatch(productSlice.actions.productFailed());
    toast.error(error.response?.data?.message || "Failed to fetch products");
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  dispatch(productSlice.actions.productRequest());
  try {
    const res = await axiosInstance.delete(
      `/product/admin/delete/${productId}`
    );
    dispatch(productSlice.actions.removeProductFromList(productId));
    dispatch(productSlice.actions.productSuccess());
    toast.success(res.data.message || "Product deleted successfully.");
  } catch (error) {
    dispatch(productSlice.actions.productFailed());
    toast.error(error.response?.data?.message || "Failed to delete product");
  }
};

export const {
  productRequest,
  productSuccess,
  productFailed,
  setProducts,
  addProduct,
  updateProductInList,
  removeProductFromList,
} = productSlice.actions;

export default productSlice.reducer;
