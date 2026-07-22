import API from "../redux/apiInstance";

export interface CacheOptions {
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean | "always" | ((query: any) => boolean | "always");
  refetchOnReconnect?: boolean | "always" | ((query: any) => boolean | "always");
  refetchOnMount?: boolean | "always" | ((query: any) => boolean | "always");
}

export const queryOptions = {
  products: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  productDetail: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  homeSection: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  category: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  search: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  cart: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  wishlist: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  compare: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  orders: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  admin: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  user: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,
  testimonials: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  } as CacheOptions,

  // central factory for fetching a single product details (supports prefetching and detail queries)
  single: (id: number) => ({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await API.get(`/product/getsingleproduct/${id}`);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  }),
};
