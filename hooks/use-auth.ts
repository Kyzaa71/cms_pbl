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
          if (typeof json?.role === "string") return json.role;
          const rawRoles = json?.role;
          if (Array.isArray(rawRoles)) {
            const roles = rawRoles.map((r) => {
              if (typeof r === "string") return r;
              if (r && typeof r === "object" && "name" in (r as Record<string, unknown>)) {
                const n = (r as { name?: unknown }).name;
                return typeof n === "string" ? n : "";
              }
              return "";
            });
            if (roles.some((r) => r.toLowerCase().replace(/[\s_-]+/g, "") === "projectadmin")) return "projectadmin";
            return roles[0] || "";
          }
          if (json?.role?.name && typeof json.role.name === "string") return json.role.name;
          return "";
        } catch {
          return "";
        }
      })();
      const roleKey = (roleNameRaw || "").toLowerCase().replace(/[\s_-]+/g, "").trim();
      if (roleKey === "projectadmin") return true;
      if (roleKey === "admin") return true;
      if (roleKey === "manager" && action === "approve" && module === "ContentEntry") return true;
      if (roleKey === "editor") {
        if (module === "ContentEntry" && (action === "create" || action === "update")) return true;
        if (module === "Media" && (action === "create" || action === "update")) return true;
      }
      if (roleKey === "contentwriter") {
        if (module === "ContentEntry" && (action === "create" || action === "update")) return true;
        if (module === "Media" && (action === "create" || action === "read")) return true;
        if (module === "SEO" && action === "read") return true;
      }
      if (roleKey === "seospecialist") {
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
