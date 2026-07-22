export interface CacheOptions {
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean | "always" | ((query: any) => boolean | "always");
  refetchOnReconnect?: boolean | "always" | ((query: any) => boolean | "always");
  refetchOnMount?: boolean | "always" | ((query: any) => boolean | "always");
}

export const queryOptions: Record<
  | "products"
  | "productDetail"
  | "homeSection"
  | "category"
  | "search"
  | "cart"
  | "wishlist"
  | "compare"
  | "orders"
  | "admin"
  | "user"
  | "testimonials",
  CacheOptions
> = {
  products: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  productDetail: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  homeSection: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  category: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  search: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  cart: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  wishlist: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  compare: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  orders: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  admin: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  user: {
    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 15, // 15 mins
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  testimonials: {
    staleTime: 1000 * 60 * 2, // 2 mins
    gcTime: 1000 * 60 * 10, // 10 mins
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
};
