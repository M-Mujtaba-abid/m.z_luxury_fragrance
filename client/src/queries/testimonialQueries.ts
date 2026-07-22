import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import { queryOptions } from "../lib/queryOptions";

export interface TestimonialPayload {
  name: string;
  country: string;
  rating: number;
  gender: "male" | "female";
  thinking: string;
}

export interface Testimonial extends TestimonialPayload {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PUBLIC_KEY = ["testimonials"];
const ADMIN_KEY = ["admin", "testimonials"];

// Public submission - no auth required, matches POST /testimonial.
export const useSubmitTestimonialMutation = () => {
  return useMutation<Testimonial, Error, TestimonialPayload>({
    mutationFn: async (payload) => {
      const response = await API.post("/testimonial", payload);
      return response.data.data;
    },
  });
};

// Public: approved testimonials for the home page, matches GET /testimonial.
export const usePublicTestimonialsQuery = () => {
  return useQuery<Testimonial[]>({
    queryKey: PUBLIC_KEY,
    queryFn: async () => {
      const response = await API.get("/testimonial");
      return response.data.data;
    },
    ...queryOptions.testimonials,
  });
};

// --- Admin ---

// Protected by isAuthenticated + isAdmin server-side (matches GET /testimonial/admin).
export const useAdminTestimonialsQuery = () => {
  return useQuery<Testimonial[]>({
    queryKey: ADMIN_KEY,
    queryFn: async () => {
      const response = await API.get("/testimonial/admin");
      return response.data.data;
    },
    ...queryOptions.admin,
  });
};

// Matches PATCH /testimonial/admin/:id/status - approve or hide a testimonial.
export const useAdminApproveTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Testimonial, Error, { id: number; isActive: boolean }>({
    mutationFn: async ({ id, isActive }) => {
      const response = await API.patch(`/testimonial/admin/${id}/status`, { isActive });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEY });
    },
  });
};

interface AdminEditPayload {
  id: number;
  name?: string;
  country?: string;
  rating?: number;
  gender?: "male" | "female";
  thinking?: string;
}

// Matches PATCH /testimonial/admin/:id - edit the submitted content.
export const useAdminEditTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Testimonial, Error, AdminEditPayload>({
    mutationFn: async ({ id, ...changes }) => {
      const response = await API.patch(`/testimonial/admin/${id}`, changes);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEY });
    },
  });
};

// Matches DELETE /testimonial/admin/:id.
export const useAdminDeleteTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await API.delete(`/testimonial/admin/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEY });
    },
  });
};
