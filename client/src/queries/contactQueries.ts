import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import { queryOptions } from "../lib/queryOptions";

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactMessagePayload {
  id: number;
  status: "pending" | "replied";
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
}

// Public submission - no auth required, matches POST /contact.
export const useSubmitContactMessageMutation = () => {
  return useMutation<ContactMessage, Error, ContactMessagePayload>({
    mutationFn: async (payload: ContactMessagePayload) => {
      const response = await API.post("/contact", payload);
      return response.data.data;
    },
  });
};

// --- Admin ---

// Protected by isAuthenticated + isAdmin server-side (matches GET /contact).
export const useAdminContactMessagesQuery = () => {
  return useQuery<ContactMessage[]>({
    queryKey: ["admin", "contact-messages"],
    queryFn: async () => {
      const response = await API.get("/contact");
      return response.data.data;
    },
    ...queryOptions.admin,
  });
};

interface AdminReplyPayload {
  id: number;
  replyText: string;
}

// Matches POST /contact/:id/reply - persists the reply and emails the sender.
export const useAdminReplyToMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactMessage, Error, AdminReplyPayload>({
    mutationFn: async ({ id, replyText }) => {
      const response = await API.post(`/contact/${id}/reply`, { replyText });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact-messages"] });
    },
  });
};
