import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      availability,
      price = "",
      category = "",
      ratings = "",
      search = "",
      page = 1,
    } = {},
    thunkAPI,
  ) => {
    try {
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (price) params.append("price", price);
      if (search) params.append("search", search);
      if (ratings) params.append("ratings", ratings);
      if (availability) params.append("availability", availability);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(`/product?${params.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchProductDetails = createAsyncThunk(
  "product/singleProduct",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/product/singleProduct/${id}`);
      return res.data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch product details",
      );
    }
  },
);

export const postReview = createAsyncThunk(
  "product/post-new/review",
  async ({ productId, review }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        review,
      );
      toast.success(res.data.message);
      return res.data.review;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to post review.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/delete/review",
  async ({ productId, reviewId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete/review/${productId}`,
      );
      toast.success(res.data.message);
      return reviewId;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to delete review.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const fetchProductWithAI = createAsyncThunk(
  "product/ai-search",
  async (userPrompt, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/product/ai-search`, { userPrompt });
      thunkAPI.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to fetch AI Filtered products";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: null,
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedProducts = action.payload?.products || [];
        state.products = fetchedProducts;
        state.newProducts =
          action.payload?.newProducts && action.payload.newProducts.length > 0
            ? action.payload.newProducts
            : fetchedProducts.slice(0, 50);

        const topRatedFromApi =
          action.payload?.topRatedProducts && action.payload.topRatedProducts.length > 0
            ? action.payload.topRatedProducts
            : fetchedProducts;

        state.topRatedProducts = topRatedFromApi.filter(
          (p) => Number(p.ratings) > 4
        );
        state.totalProducts = action.payload?.totalProducts || 0;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.productDetails = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.productReviews = action.payload?.reviews || [];
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.loading = false;
        state.productDetails = null;
      })
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        if (action.payload) {
          state.productReviews = [action.payload, ...state.productReviews];
        }
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(
          (review) => (review.review_id || review.id) !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })
      .addCase(fetchProductWithAI.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAI.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload?.products || [];
        state.totalProducts = action.payload?.products?.length || 0;
      })
      .addCase(fetchProductWithAI.rejected, (state) => {
        state.aiSearching = false;
      });
  },
});

export default productSlice.reducer;
