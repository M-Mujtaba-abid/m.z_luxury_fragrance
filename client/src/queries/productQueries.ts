import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import type { Product } from "../redux/Admin/typesAdminComponent/productTypes";

// Configured standard cache limits
const STALE_TIME = 1000 * 60 * 5; // 5 mins
const GC_TIME = 1000 * 60 * 15; // 15 mins

// --- Queries ---

export const useProductsQuery = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await API.get("/product/getallproduct");
      return response.data.data || response.data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
};

export const useFeaturedProductsQuery = () => {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const response = await API.get("/product/getfeaturedproducts", {
        params: { getonsaleproducts: "true" },
      });
      return response.data.data || response.data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
};

export const useNewArrivalsQuery = () => {
  return useQuery<Product[]>({
    queryKey: ["products", "new-arrivals"],
    queryFn: async () => {
      const response = await API.get("/product/getnewarrivals", {
        params: { isNewArrival: "true" },
      });
      return response.data.data || response.data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
};

export const useOnSaleProductsQuery = () => {
  return useQuery<Product[]>({
    queryKey: ["products", "on-sale"],
    queryFn: async () => {
      const response = await API.get("/product/getonsaleproducts", {
        params: { isfeatured: "true" },
      });
      return response.data.data || response.data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
};

export const useSingleProductQuery = (productId: number | undefined) => {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");
      const response = await API.get(`/product/getsingleproduct/${productId}`);
      return response.data.data || response.data;
    },
    enabled: !!productId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
  });
};

export const useSearchProductsQuery = (query: string) => {
  return useQuery<Product[]>({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await API.get("/product/search", {
        params: { q: query },
      });
      return response.data.data || response.data;
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 2, // 2 mins for search
    gcTime: 1000 * 60 * 5,
  });
};

export const useProductsByCategoryQuery = (category: string | undefined) => {
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!category) return [];
      // Attempt backend specific category endpoint if it exists
      try {
        const response = await API.get(`/product/getproductbycategory/${category}`);
        return response.data.data || response.data;
      } catch (err) {
        // Fallback to filtering all products locally if category route is not populated or fails
        const response = await API.get("/product/getallproduct");
        const list = response.data.data || response.data;
        return list.filter(
          (p: Product) => p.category.toLowerCase() === category.toLowerCase()
        );
      }
    },
    enabled: !!category,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

// --- Mutations for Admin & Invalidation ---

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await API.post("/product/postproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data || response.data;
    },
    onSuccess: () => {
      // Invalidate products query cache to trigger background refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await API.patch(`/product/updateproduct/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data || response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await API.delete(`/product/deleteproduct/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
