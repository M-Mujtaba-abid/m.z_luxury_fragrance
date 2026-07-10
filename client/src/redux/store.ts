


import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Admin/AdminSlice/ProductSlice";
import userReducer from "./auth/AuthSlice";
import cartReducer from "./user/cart/CartSlice";
import orderReducer from "./Admin/AdminSlice/OrderSlice";
import loaderReducer from "./LoaderSlice";
import paymentReducer from "./payment/PaymentSlice";



export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    loader: loaderReducer,
     payment: paymentReducer,
      
  },
  
});

// 🔹 TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
