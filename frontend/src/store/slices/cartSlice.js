import { createSlice } from "@reduxjs/toolkit";

const initialCart = (() => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
})();

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: initialCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const product = payload.product ? payload.product : payload;
      const qty = payload.quantity ? Number(payload.quantity) : 1;

      const productId = product.id || product._id;
      const existingItem = state.cart.find(
        (i) => (i.product?.id || i.product?._id) === productId
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        state.cart.push({ product, quantity: qty });
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (i) => (i.product?.id || i.product?._id) !== productId
      );
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.cart = state.cart.filter(
          (i) => (i.product?.id || i.product?._id) !== id
        );
      } else {
        const item = state.cart.find(
          (i) => (i.product?.id || i.product?._id) === id
        );
        if (item) {
          item.quantity = Number(quantity);
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.cart = state.cart.filter(
          (i) => (i.product?.id || i.product?._id) !== id
        );
      } else {
        const item = state.cart.find(
          (i) => (i.product?.id || i.product?._id) === id
        );
        if (item) {
          item.quantity = Number(quantity);
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;