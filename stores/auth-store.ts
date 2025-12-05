import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/backend-models";

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken?: string, user?: User | null) => void;
  clearAuth: () => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (token, refreshToken, user) => set(() => {
        if (typeof document !== "undefined") {
          document.cookie = `auth_token=${encodeURIComponent(token)}; path=/;`;
          try {
            localStorage.setItem("auth_token", token);
            if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
          } catch {}
        }
        return { token, refreshToken: refreshToken || null, user: user || null, isAuthenticated: true };
      }),
      clearAuth: () => set(() => {
        if (typeof document !== "undefined") {
          document.cookie = "auth_token=; Max-Age=0; path=/";
          try {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          } catch {}
        }
        return { token: null, refreshToken: null, user: null, isAuthenticated: false };
      }),
      setUser: (user) => set({ user }),
    }),
    { name: "auth-store" }
  )
);

