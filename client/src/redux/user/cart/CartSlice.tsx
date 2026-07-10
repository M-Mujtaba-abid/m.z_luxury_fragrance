// import { createSlice } from "@reduxjs/toolkit";
// import { addToCart, getUserCart, updateCartItem, removeCartItem, clearCart } from "./CartThunk";

// interface CartItem {
//   id: number;
//   userId: number;
//   productId: number;
//   quantity: number;
//   priceAtAddition: number;
//   totalPrice: number;
//   Product: {
//     id: number;
//     title: string;
//     productImage: string;
//     price: number;
//   };
//   User: {
//     id: number;
//     firstName: string;
//     email: string;
//   };
// }

// interface CartState {
//   cartItems: CartItem[];
//   loading: boolean;
//   error: string | null;
//   showCartModal: boolean;
//   lastAddedItem: CartItem | null;
// }

// const initialState: CartState = {
//   cartItems: [],
//   loading: false,
//   error: null,
//   showCartModal: false,
//   lastAddedItem: null,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     showCartModal: (state, action) => {
//       state.showCartModal = true;
//       state.lastAddedItem = action.payload;
//     },
//     hideCartModal: (state) => {
//       state.showCartModal = false;
//       state.lastAddedItem = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Add to Cart
//     builder.addCase(addToCart.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(addToCart.fulfilled, (state, action) => {
//       state.loading = false;
//       // Update cart items with new item
//       const existingIndex = state.cartItems.findIndex(
//         item => item.productId === action.payload.productId
//       );
//       if (existingIndex !== -1) {
//         state.cartItems[existingIndex] = action.payload;
//       } else {
//         state.cartItems.push(action.payload);
//       }
//       // Show modal with added item
//       state.showCartModal = true;
//       state.lastAddedItem = action.payload;
//     });
//     builder.addCase(addToCart.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Get User Cart
//     builder.addCase(getUserCart.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(getUserCart.fulfilled, (state, action) => {
//       state.loading = false;
//       state.cartItems = action.payload;
//     });
//     builder.addCase(getUserCart.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Update Cart Item
//     builder.addCase(updateCartItem.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(updateCartItem.fulfilled, (state, action) => {
//       state.loading = false;
//       const index = state.cartItems.findIndex(item => item.id === action.payload.id);
//       if (index !== -1) {
//         state.cartItems[index] = action.payload;
//       }
//     });
//     builder.addCase(updateCartItem.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Remove Cart Item
//     builder.addCase(removeCartItem.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(removeCartItem.fulfilled, (state, action) => {
//       state.loading = false;
//       state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
//     });
//     builder.addCase(removeCartItem.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Clear Cart
//     builder.addCase(clearCart.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(clearCart.fulfilled, (state) => {
//       state.loading = false;
//       state.cartItems = [];
//     });
//     builder.addCase(clearCart.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// export const { clearError, showCartModal, hideCartModal } = cartSlice.actions;
// export default cartSlice.reducer;

// CartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { addToCart, getUserCart, updateCartItem, removeCartItem, clearCart } from "./CartThunk";

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  priceAtAddition: number;
  totalPrice: number;
  Product: {
    id: number;
    title: string;
    productImage: string;
    price: number;
  };
  User: {
    id: number;
    firstName: string;
    email: string;
  };
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean; // ✅ now used only for getUserCart
  error: string | null;
  showCartModal: boolean;
  lastAddedItem: CartItem | null;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
  showCartModal: false,
  lastAddedItem: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    showCartModal: (state, action) => {
      state.showCartModal = true;
      state.lastAddedItem = action.payload;
    },
    hideCartModal: (state) => {
      state.showCartModal = false;
      state.lastAddedItem = null;
    },
    // ✅ NEW: local update reducer (optimistic update)
    updateItemQuantityLocally: (state, action) => {
      const index = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.cartItems[index].quantity = action.payload.quantity;
        state.cartItems[index].totalPrice = state.cartItems[index].priceAtAddition * action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      const existingIndex = state.cartItems.findIndex(
        item => item.productId === action.payload.productId
      );
      if (existingIndex !== -1) {
        state.cartItems[existingIndex] = action.payload;
      } else {
        state.cartItems.push(action.payload);
      }
      state.showCartModal = true;
      state.lastAddedItem = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // ✅ Only show loader when fetching full cart
    builder.addCase(getUserCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
    });
    builder.addCase(getUserCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ✅ Removed loading=true here
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      const index = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.cartItems[index] = action.payload;
      }
    });

    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    });

    builder.addCase(clearCart.fulfilled, (state) => {
      state.cartItems = [];
    });
  },
});

export const { clearError, showCartModal, hideCartModal, updateItemQuantityLocally } = cartSlice.actions;
export default cartSlice.reducer;
