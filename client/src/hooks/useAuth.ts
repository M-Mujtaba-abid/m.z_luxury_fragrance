/**
 * useAuth – thin hook that reads auth state from localStorage and exposes
 * React Query mutations for login / logout / register.
 *
 * Strategy: Auth "session" state (user object + token) lives in localStorage,
 * exactly as AuthSlice already initialised its state from localStorage.
 * We use a small useState so consumers re-render after login/logout without
 * needing Redux, while ProtectedRoute (which still reads state.user) continues
 * to work because AuthSlice's initial values are also read from localStorage.
 */
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "../queries/authQueries";
import { logout as reduxLogout } from "../redux/slices/AuthSlice";
import type { AppDispatch } from "../redux/store";

// Reads the persisted user object from localStorage safely.
const getPersistedUser = (): any | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getPersistedToken = (): string | null =>
  localStorage.getItem("token");

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Local state mirrors localStorage so components re-render on auth change.
  const [user, setUser] = useState<any | null>(getPersistedUser);
  const [token, setToken] = useState<string | null>(getPersistedToken);

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const data = await loginMutation.mutateAsync(credentials);
      // loginMutation already wrote to localStorage — just sync local state.
      const userData = data?.user || data?.data?.user;
      const tokenData = data?.token || data?.data?.token;
      if (userData) setUser(userData);
      if (tokenData) setToken(tokenData);
      return data;
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    // Clear local state
    setUser(null);
    setToken(null);
    // Also clear Redux slice so ProtectedRoute gates correctly without refresh
    dispatch(reduxLogout());
  }, [logoutMutation, dispatch]);

  const register = useCallback(
    async (formData: FormData) => {
      return registerMutation.mutateAsync(formData);
    },
    [registerMutation]
  );

  return {
    user,
    token,
    isLoggedIn: !!token,
    isAdmin: user?.userRole === "Admin",

    // Mutations
    login,
    logout,
    register,

    // Loading / error states
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error?.message ?? null,
    logoutLoading: logoutMutation.isPending,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error?.message ?? null,
  };
};
