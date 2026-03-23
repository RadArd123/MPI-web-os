import { create } from "zustand";
import type {
  AuthSession,
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
} from "@/types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/auth/getSession");
      if (response.ok) {
        const data = await response.json();
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        set({ user: data.user, isAuthenticated: true });
        return { success: true };
      }

      return { success: false, error: data.error || "ACCESS_DENIED" };
    } catch (error) {
      return { success: false, error: "SYSTEM_FAILURE_CONNECTION_LOST" };
    }
  },
  signup: async (credentials: SignupCredentials) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
 
        set({ user: data.user, isAuthenticated: true });
        return { success: true };
      }

      return { success: false, error: data.error || "INITIALIZATION_FAILED" };
    } catch (error) {
      return { success: false, error: "CORE_PROCESS_FAILURE" };
    }
  },
 logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ user: null, isAuthenticated: false });

      window.location.href = '/login';
    } catch (error) {
      console.error("LOGOUT_SEQUENCE_INTERRUPTED");
    }
  },
}));
