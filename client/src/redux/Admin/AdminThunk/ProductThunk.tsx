


import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../apiInstance';
import type { ProductData } from '../typesAdminComponent/productTypes';
import { showLoader, hideLoader } from '../../LoaderSlice';

// Create product thunk
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: ProductData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());

      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('status', productData.status);
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
      formData.append('category', productData.category);
      formData.append('Quantity', productData.Quantity);
      formData.append('isFeatured', productData.isFeatured.toString());
      formData.append('isNewArrival', productData.isNewArrival.toString());
      formData.append('isOnSale', productData.isOnSale.toString());
      if (productData.discountPrice !== undefined) {
        formData.append('discountPrice', productData.discountPrice.toString());
      }
      formData.append('productImage', productData.productImage);

      const response = await API.post('/product/postproduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Fetch all products thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get('/product/getallproduct');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Get product by ID thunk
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get(`/product/getsingleproduct/${productId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Update product thunk
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (
    { id, ...updateData }: { id: number } & Partial<ProductData>,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(showLoader());

      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'productImage' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await API.patch(`/product/updateproduct/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Delete product thunk
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      await API.delete(`/product/deleteproduct/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Get total number of products thunk
export const getTotalProductsCount = createAsyncThunk(
  'products/getTotalProductsCount',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get('/product/getNumberOfTotalproduct');
      return response.data.data.totalProducts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total products count');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Featured Products
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get('/product/getfeaturedproducts', { params: { getonsaleproducts: 'true' } });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// New Arrivals
export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get('/product/getnewarrivals', { params: { isNewArrival: 'true' } });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// On Sale
export const fetchOnSaleProducts = createAsyncThunk(
  'products/fetchOnSaleProducts',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get('/product/getonsaleproducts', { params: { isfeatured: 'true' } });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch on sale products');
    } finally {
      dispatch(hideLoader());
    }
  }
);



// 🔍 Search Products Thunk
export const searchProductsThunk = createAsyncThunk(
  "products/searchProducts",
  async (query: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/product/search", {
        params: { q: query }, // backend expects ?q=apple
      });
      return response.data; // backend returns array
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products"
      );
    } finally {
      dispatch(hideLoader());
    }
  }
);
