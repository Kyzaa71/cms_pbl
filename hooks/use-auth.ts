"use client";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/services/auth-service";
import { api } from "@/lib/api-client";
import { useCallback } from "react";
import type { Permission as BackendPermission } from "@/types/backend-models";

export function useAuth() {
  const { user, token, refreshToken, isAuthenticated, setAuth, clearAuth, setUser } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setAuth(res.access_token, res.refresh_token || null, null);
    try { await getCurrentUser(); } catch {}
    return res;
  }, [setAuth]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.signup(name, email, password);
    setAuth(res.access_token, res.refresh_token, res.user);
    return res;
  }, [setAuth]);

  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (tokenStr: string, newPassword: string) => {
    await authService.resetPassword(tokenStr, newPassword);
  }, []);

  const getCurrentUser = useCallback(async () => {
    const u = await authService.getCurrentUser();
    if (u) {
      try {
        const t = api.getToken();
        const r = typeof document !== "undefined" ? localStorage.getItem("refresh_token") || undefined : undefined;
        if (t) setAuth(t, r, u);
        else setUser(u);
      } catch {
        setUser(u);
      }
    }
    return u;
  }, [setUser, setAuth]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    clearAuth();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  }, [clearAuth]);

  const can = useCallback(
    (module: "ContentEntry" | "Media" | "SEO", action: "create" | "read" | "update" | "delete" | "approve") => {
      const roleNameRaw = user?.role?.name || (() => {
        const token = api.getToken();
        if (!token) return "";
        try {
          const part = token.split(".")[1] || "";
          const json = JSON.parse(atob(part));
          const role = typeof json?.role === "string" ? json.role : "";
          return role;
        } catch {
          return "";
        }
      })();
      const roleName = (roleNameRaw || "").toLowerCase().trim();
      if (roleName === "admin") return true;
      if (roleName === "manager" && action === "approve" && module === "ContentEntry") return true;
      if (roleName === "editor") {
        if (module === "ContentEntry" && (action === "create" || action === "update")) return true;
        if (module === "Media" && (action === "create" || action === "update")) return true;
      }
      if (roleName === "content_writer") {
        if (module === "ContentEntry" && (action === "create" || action === "update")) return true;
        if (module === "Media" && (action === "create" || action === "read")) return true;
        if (module === "SEO" && action === "read") return true;
      }
      if (roleName === "seo_specialist") {
        if (module === "SEO" && (action === "create" || action === "read" || action === "update")) return true;
        if (module === "ContentEntry" && (action === "read" || action === "update")) return true;
      }
      const perms = (user?.role?.permissions || []) as BackendPermission[];
      return perms.some((p) => p.module === module && p.action === action);
    },
    [user]
  );

  return { user, token, refreshToken, isAuthenticated, login, signup, forgotPassword, resetPassword, getCurrentUser, logout, can };
}
