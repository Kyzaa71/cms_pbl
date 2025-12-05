import { StandardResponse } from "@/types/api-response";

const DEFAULT_API_PORT = Number(process.env.NEXT_PUBLIC_API_PORT || 8080);

function resolveBaseUrl(): string {
  const cfg = process.env.NEXT_PUBLIC_API_URL || "";
  if (typeof window !== "undefined") {
    const proto = window.location.protocol || "http:";
    const hostname = window.location.hostname || "localhost";

    if (!cfg) {
      return `${proto}//${hostname}:${DEFAULT_API_PORT}`;
    }

    try {
      const u = new URL(cfg, `${proto}//${hostname}`);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        u.hostname = hostname;
        if (!u.port) u.port = String(DEFAULT_API_PORT);
      }
      return u.toString().replace(/\/$/, "");
    } catch {
      return `${proto}//${hostname}:${DEFAULT_API_PORT}`;
    }
  }
  return cfg || "";
}

const BASE_URL = resolveBaseUrl();

export function getBaseUrl(): string {
  return BASE_URL;
}

function getToken(): string | null {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
    if (match) return decodeURIComponent(match[1]);
    try {
      const ls = localStorage.getItem("auth_token");
      if (ls) return ls;
    } catch {}
  }
  return null;
}

function setToken(token: string | null) {
  if (typeof document !== "undefined") {
    if (token) {
      document.cookie = `auth_token=${encodeURIComponent(token)}; path=/;`;
      try { localStorage.setItem("auth_token", token); } catch {}
    } else {
      document.cookie = "auth_token=; Max-Age=0; path=/";
      try { localStorage.removeItem("auth_token"); } catch {}
    }
  }
}

async function parseResponse<T>(res: Response): Promise<StandardResponse<T>> {
  const json = await res.json().catch(() => ({}));
  return json as StandardResponse<T>;
}

export async function request<T>(path: string, init: RequestInit & { retry?: number } = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = getToken();
  const retry = init.retry ?? 3;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const res = await fetch(url, { ...init, headers, mode: "cors" });

      if (res.status === 401) {
        setToken(null);
        if (typeof window !== "undefined") window.location.href = "/auth/login";
        throw new Error("Unauthorized");
      }

      if (res.status >= 500) {
        if (attempt < retry - 1) continue;
      }

      const body = await parseResponse<T>(res);

      if (!res.ok || body.success === false) {
        let msg = body.error?.message || body.message || res.statusText;
        if (res.status === 403) msg = "No permission";
        if (res.status === 429) msg = "Too Many Requests";
        const err = new Error(msg);
        (err as any).code = body.error?.code || String(res.status);
        throw err;
      }

      return (body.data as T) ?? (body as unknown as T);
    } catch (e) {
      if (e instanceof TypeError) {
        const err = new Error("Network error: failed to reach API server. Check API URL or device connectivity.");
        (err as any).cause = e;
        throw err;
      }
      if (attempt < retry - 1) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }

  throw new Error("Request failed");
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  setToken,
  getToken,
};
