import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { productApi } from "./api/productApi";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },

  middleware: (gDM) =>
    gDM().concat(
      userAPI.middleware,
      productApi.middleware,
      orderApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
