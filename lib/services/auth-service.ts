import { api } from "@/lib/api-client";
import { User } from "@/types/backend-models";
import { userService } from "@/lib/services/user-service";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type RegisterResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

type RefreshResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
};

function parsePayload(token: string): { sub?: number; exp?: number; role?: string } | null {
  try {
    const part = token.split(".")[1] || "";
    const raw = typeof window !== "undefined" ? atob(part) : Buffer.from(part, "base64").toString();
    const json = JSON.parse(raw);
    const subVal = json?.sub;
    const expVal = json?.exp;
    const roleVal = json?.role;
    const sub = typeof subVal === "number" ? subVal : (typeof subVal === "string" ? parseInt(subVal, 10) : undefined);
    const exp = typeof expVal === "number" ? expVal : (typeof expVal === "string" ? parseInt(expVal, 10) : undefined);
    const role = typeof roleVal === "string" ? roleVal : undefined;
    return { sub, exp, role };
  } catch {
    return null;
  }
}

let refreshing: Promise<RefreshResponse> | null = null;

export const authService = {
  async login(email: string, password: string) {
    const data = await api.post<LoginResponse>("/auth/login", { email, password });
    api.setToken(data.access_token);
    if (typeof document !== "undefined") {
      try { localStorage.setItem("refresh_token", data.refresh_token); } catch {}
    }
    return data;
  },

  async signup(name: string, email: string, password: string) {
    const data = await api.post<RegisterResponse>("/auth/register", { name, email, password });
    api.setToken(data.access_token);
    if (typeof document !== "undefined") {
      try { localStorage.setItem("refresh_token", data.refresh_token); } catch {}
    }
    return data;
  },

  async forgotPassword(email: string) {
    await api.post<unknown>("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string) {
    await api.post<unknown>("/auth/reset-password", { token, new_password: newPassword });
  },

  async getCurrentUser() {
    const access = api.getToken();
    if (!access) return null as unknown as User;

    try {
      const u = await api.get<User>("/auth/me");
      return u as User;
    } catch {
      // Fallback: try refresh token flow if available
      const payload = parsePayload(access);
      const sub = typeof payload?.sub === "number" ? payload!.sub! : null;
      const refresh = typeof document !== "undefined" ? localStorage.getItem("refresh_token") : null;
      if (!refresh || !sub) return null as unknown as User;

      if (!refreshing) {
        refreshing = api
          .post<RefreshResponse>("/auth/refresh", { user_id: sub, refresh_token: refresh })
          .finally(() => {
            refreshing = null;
          });
      }

      try {
        const data = await refreshing;
        api.setToken(data.access_token);
        if (typeof document !== "undefined") localStorage.setItem("refresh_token", data.refresh_token);
        return data.user;
      } catch {
        return null as unknown as User;
      }
    }
  },

  async logout() {
    try {
      await api.post<unknown>("/auth/logout");
    } finally {
      api.setToken(null);
    }
  },
};
