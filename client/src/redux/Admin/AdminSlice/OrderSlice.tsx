// // src/redux/OrderSlice.ts
// import { createSlice } from "@reduxjs/toolkit";
// import {
//   createOrder,
//   fetchMyOrders,
//   updateOrderStatus,
//   deleteOrder,
// } from "../../Admin/AdminThunk/OrderThunk";

// interface OrderState {
//   orders: any[];
//   order: any | null;
//   loading: boolean;
//   error: string | null;
//   success: string | null;
// }

// const initialState: OrderState = {
//   orders: [],
//   order: null,
//   loading: false,
//   error: null,
//   success: null,
// };

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     clearOrderError: (state) => {
//       state.error = null;
//     },
//     clearOrderSuccess: (state) => {
//       state.success = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // ========================
//     // 🔹 Create Order
//     // ========================
//     builder.addCase(createOrder.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//       state.success = null;
//     });
//     builder.addCase(createOrder.fulfilled, (state, action) => {
//       state.loading = false;
//       state.order = action.payload?.data;
//       state.orders.push(action.payload.data);
//       state.success = "Order created successfully";
//     });
//     builder.addCase(createOrder.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // ========================
//     // 🔹 Fetch Orders
//     // ========================
//     builder.addCase(fetchMyOrders.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
//       state.loading = false;
//       state.orders = action.payload;
//     });
//     builder.addCase(fetchMyOrders.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // ========================
//     // 🔹 Update Order Status
//     // ========================
//     builder.addCase(updateOrderStatus.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//       state.success = null;
//     });
//     builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
//       state.loading = false;
//       const updatedOrder = action.payload?.data;
//       if (updatedOrder) {
//         state.orders = state.orders.map((o) =>
//           o.id === updatedOrder.id ? updatedOrder : o
//         );
//         state.success = "Order status updated successfully";
//       }
//     });
//     builder.addCase(updateOrderStatus.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // ========================
//     // 🔹 Delete Order
//     // ========================
//     builder.addCase(deleteOrder.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//       state.success = null;
//     });
//     builder.addCase(deleteOrder.fulfilled, (state, action) => {
//       state.loading = false;
//       state.orders = state.orders.filter((o) => o.id !== action.payload.id);
//       state.success = "Order deleted successfully";
//     });
//     builder.addCase(deleteOrder.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// export const { clearOrderError, clearOrderSuccess } = orderSlice.actions;
// export default orderSlice.reducer;



// src/redux/OrderSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchMyOrders,
  updateOrderStatus,
  deleteOrder,
  fetchAllOrders,
  fetchOrderById,
  fetchTotalOrders,
  trackGuestOrder,
} from "../../Admin/AdminThunk/OrderThunk";

interface OrderState {
  orders: any[];
  order: any | null;
  trackedOrder: any | null;
  totalOrders: number;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  trackedOrder: null,
  totalOrders: 0,
  loading: false,
  error: null,
  success: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.success = null;
    },
    clearTrackedOrder: (state) => {
      state.trackedOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ========================
    // 🔹 Create Order
    // ========================
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload?.data;
      state.orders.push(action.payload?.data);
      state.success = "Order created successfully";
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Fetch My Orders
    // ========================
    builder.addCase(fetchMyOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchMyOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Update Order Status
    // ========================
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false;
      const updatedOrder = action.payload?.data;
      if (updatedOrder) {
        state.orders = state.orders.map((o) =>
          o.id === updatedOrder.id ? updatedOrder : o
        );
        state.success = "Order status updated successfully";
      }
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Delete Order
    // ========================
    builder.addCase(deleteOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter((o) => o.id !== action.payload.id);
      state.success = "Order deleted successfully";
    });
    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Fetch All Orders (Admin)
    // ========================
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Fetch Single Order By ID
    // ========================
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.order = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Fetch Total Orders
    // ========================
    builder.addCase(fetchTotalOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTotalOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.totalOrders = action.payload;
    });
    builder.addCase(fetchTotalOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Track Guest Order (Order ID + email)
    // ========================
    builder.addCase(trackGuestOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.trackedOrder = null;
    });
    builder.addCase(trackGuestOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.trackedOrder = action.payload;
    });
    builder.addCase(trackGuestOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.trackedOrder = null;
    });
  },
});

export const { clearOrderError, clearOrderSuccess, clearTrackedOrder } = orderSlice.actions;
export default orderSlice.reducer;
