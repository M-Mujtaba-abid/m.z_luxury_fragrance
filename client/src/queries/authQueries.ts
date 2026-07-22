import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import { queryOptions } from "../lib/queryOptions";

// --------------- Queries ---------------

// Logged-in user's own profile. Used by profile pages.
export const useUserProfileQuery = () => {
  return useQuery<any>({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await API.get("/user/getuserprofile");
      return response.data.data || response.data;
    },
    ...queryOptions.user,
  });
};

// Admin — total user count for dashboard KPI.
export const useTotalUsersQuery = () => {
  return useQuery<number>({
    queryKey: ["users", "admin", "total"],
    queryFn: async () => {
      const response = await API.get("/user/totaluser");
      return response.data.data.totalUser;
    },
    ...queryOptions.admin,
  });
};

// --------------- Mutations ---------------

export const useRegisterMutation = () => {
  return useMutation<any, Error, FormData>({
    mutationFn: async (formData) => {
      const response = await API.post("/user/register", formData);
      return response.data;
    },
  });
};

export const useLoginMutation = () => {
  return useMutation<any, Error, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      const response = await API.post("/user/login", credentials);
      // Persist token to localStorage so ProtectedRoute & API interceptor can use it
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      const userData = response.data?.user || response.data?.data?.user;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      return response.data;
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, void>({
    mutationFn: async () => {
      const response = await API.post("/user/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return response.data;
    },
    onSuccess: () => {
      // Clear all cached queries so nothing stale remains after logout
      queryClient.clear();
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, FormData>({
    mutationFn: async (formData) => {
      const response = await API.patch("/user/updateuserprofile", formData);
      return response.data;
    },
    onSuccess: (data) => {
      const updated = data?.data || data;
      if (updated) localStorage.setItem("user", JSON.stringify(updated));
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};

export const useUpdatePasswordMutation = () => {
  return useMutation<
    any,
    Error,
    { oldPassword: string; newPassword: string; confirmPassword: string }
  >({
    mutationFn: async (payload) => {
      const response = await API.patch("/user/updatepassword", payload);
      return response.data;
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation<any, Error, { email: string }>({
    mutationFn: async (payload) => {
      const response = await API.post("/user/forgetpassword", payload);
      return response.data;
    },
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation<any, Error, { email: string; otp: string }>({
    mutationFn: async (payload) => {
      const response = await API.post("/user/verifyotp", payload);
      return response.data;
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<
    any,
    Error,
    { email: string; newPassword: string; confirmPassword: string }
  >({
    mutationFn: async (payload) => {
      const response = await API.post("/user/resetpassword", payload);
      return response.data;
    },
  });
};
