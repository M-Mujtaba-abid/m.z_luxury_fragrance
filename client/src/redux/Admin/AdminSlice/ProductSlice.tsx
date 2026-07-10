import { createSlice } from "@reduxjs/toolkit";
import { createProduct, fetchProducts, deleteProduct, getProductById, updateProduct, getTotalProductsCount, fetchFeaturedProducts, fetchNewArrivals, fetchOnSaleProducts, searchProductsThunk } from "../AdminThunk/ProductThunk";
import type { ProductState } from "../typesAdminComponent/productTypes";

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  totalProductsCount: 0,
  loading: false,
  error: null,
  featuredProducts: [],
  newArrivals: [],
  searchResults: [], // 🔍 yahan store hoga
  onSaleProducts: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Clear error
    clearError: (state: any) => {
      state.error = null;
    },
    // Clear current product
    clearCurrentProduct: (state: any) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Create Product
    builder.addCase(createProduct.pending, (state: any) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state: any, action) => {
      state.loading = false;
      state.products.push(action.payload); // add new product to state
      state.error = null;
    });
    builder.addCase(createProduct.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Products
    builder.addCase(fetchProducts.pending, (state: any) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state: any, action) => {
      state.loading = false;
      state.products = action.payload;
      state.error = null;
    });
    builder.addCase(fetchProducts.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Product By ID
    builder.addCase(getProductById.pending, (state: any) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductById.fulfilled, (state: any, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
      state.error = null;
    });
    builder.addCase(getProductById.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Product
    builder.addCase(updateProduct.pending, (state: any) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state: any, action) => {
      state.loading = false;
      // Update product in the list
      const index = state.products.findIndex((product: any) => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      // Update current product if it's the same one
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateProduct.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Product
    builder.addCase(deleteProduct.pending, (state: any) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state: any, action) => {
      state.loading = false;
      state.products = state.products.filter((product: any) => product.id !== action.payload);
      // Clear current product if it was deleted
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
      state.error = null;
    });
    builder.addCase(deleteProduct.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Total Products Count
    builder.addCase(getTotalProductsCount.pending, (state: any) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTotalProductsCount.fulfilled, (state: any, action) => {
      state.loading = false;
      state.totalProductsCount = action.payload;
      state.error = null;
    });
    builder.addCase(getTotalProductsCount.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Featured lists
    builder.addCase(fetchFeaturedProducts.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(fetchFeaturedProducts.fulfilled, (state: any, action) => {
      state.loading = false;
      state.featuredProducts = action.payload;
    });
    builder.addCase(fetchFeaturedProducts.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
        //  New lists
    builder.addCase(fetchNewArrivals.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(fetchNewArrivals.fulfilled, (state: any, action) => {
      state.loading = false;
      state.newArrivals = action.payload;
    });
    builder.addCase(fetchNewArrivals.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
// /OnSale lists
    builder.addCase(fetchOnSaleProducts.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(fetchOnSaleProducts.fulfilled, (state: any, action) => {
      state.loading = false;
      state.onSaleProducts = action.payload;
    });
    builder.addCase(fetchOnSaleProducts.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

     // ✅ Search Products
    builder.addCase(searchProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
    });
    builder.addCase(searchProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

  },
});

export const { clearError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
