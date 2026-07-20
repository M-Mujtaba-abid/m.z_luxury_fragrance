import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/AuthSlice";
import cartReducer from "./slices/CartSlice";
import loaderReducer from "./slices/LoaderSlice";

// Removed reducers (fully migrated to React Query — slices/thunks deleted):
//   products → src/queries/productQueries.ts
//   order    → src/queries/orderQueries.ts
//   payment  → src/queries/paymentQueries.ts
//   review   → src/queries/reviewQueries.ts

export const store = configureStore({
  reducer: {
    // Auth: stays in Redux — ProtectedRoute + interceptors read state.user.token
    user: userReducer,
    // Cart: stays in Redux — CartModal reads showCartModal / lastAddedItem (UI state)
    cart: cartReducer,
    // Loader: stays in Redux — global loading overlay
    loader: loaderReducer,
  },
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
