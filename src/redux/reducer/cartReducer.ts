import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading: false,
  orderItems: [],
  // _id: "",
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  },
};
export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;
      const index = state.orderItems.findIndex(
        (i) => i.productId === action.payload.productId
      );
      if (index !== -1) state.orderItems[index] = action.payload;
      else state.orderItems.push(action.payload);
      state.loading = false;
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.orderItems = state.orderItems.filter(
        (i) => i.productId !== action.payload
      );
      state.loading = false;
    },
    calculatePrice: (state) => {
      const subtotal = state.orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subtotal * 0.18);
      state.total =
        state.subtotal + state.tax + state.shippingCharges - state.discount;
    },
    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
} = cartReducer.actions;
