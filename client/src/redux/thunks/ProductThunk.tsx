


import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../apiInstance';
import type { ProductData } from '../types/productTypes';
import { showLoader, hideLoader } from '../slices/LoaderSlice';

// Shared scalar/array/file field appender for create + update, since both
// submit the same shape of form.
const appendProductFields = (formData: FormData, productData: Partial<ProductData>) => {
  const scalarKeys: (keyof ProductData)[] = [
    'title', 'description', 'status', 'category', 'Quantity',
    'brand', 'gender', 'metaTitle', 'metaDescription', 'slug', 'publishStatus',
  ];
  scalarKeys.forEach((key) => {
    const value = productData[key];
    if (value !== undefined && value !== null) formData.append(key, value.toString());
  });

  const numberKeys: (keyof ProductData)[] = ['price', 'stock', 'discountPrice', 'coverIndex'];
  numberKeys.forEach((key) => {
    const value = productData[key];
    if (value !== undefined && value !== null) formData.append(key, value.toString());
  });

  const boolKeys: (keyof ProductData)[] = ['isFeatured', 'isNewArrival', 'isOnSale'];
  boolKeys.forEach((key) => {
    const value = productData[key];
    if (value !== undefined) formData.append(key, value.toString());
  });

  const arrayKeys: (keyof ProductData)[] = ['topNotes', 'heartNotes', 'baseNotes'];
  arrayKeys.forEach((key) => {
    const value = productData[key] as string[] | undefined;
    if (value !== undefined) formData.append(key, JSON.stringify(value));
  });

  if (productData.variants !== undefined) {
    formData.append('variants', JSON.stringify(productData.variants));
  }

  if (productData.images?.length) {
    productData.images.forEach((file) => formData.append('images', file));
  }
};

// Create product thunk
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: ProductData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());

      const formData = new FormData();
      appendProductFields(formData, productData);

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

// Fetch all products thunk.
// includeAll: admin-only escape hatch to also see draft (unpublished)
// products — storefront callers must never pass this, so it defaults to
// false/omitted, which is the published-only, customer-safe behavior.
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (includeAll: boolean | undefined, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get('/product/getallproduct', {
        params: includeAll ? { includeAll: 'true' } : undefined,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      dispatch(hideLoader());
    }
  }
);

// Get product by ID thunk. Same includeAll escape hatch as fetchProducts —
// admin views (edit form, admin detail page) must pass it so drafts can
// still be opened for editing; storefront product-detail pages must not.
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (
    { id, includeAll }: { id: number; includeAll?: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(showLoader());
      const response = await API.get(`/product/getsingleproduct/${id}`, {
        params: includeAll ? { includeAll: 'true' } : undefined,
      });
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
      appendProductFields(formData, updateData);

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
