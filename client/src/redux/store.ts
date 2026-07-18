


import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/ProductSlice";
import userReducer from "./slices/AuthSlice";
import cartReducer from "./slices/CartSlice";
import orderReducer from "./slices/OrderSlice";
import loaderReducer from "./slices/LoaderSlice";
import paymentReducer from "./slices/PaymentSlice";
import reviewReducer from "./slices/ReviewSlice";



export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    loader: loaderReducer,
     payment: paymentReducer,
     review: reviewReducer,

  },

});

// 🔹 TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
