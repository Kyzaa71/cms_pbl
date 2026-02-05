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

let refreshing: Promise<string | null> | null = null;

function getCsrfToken(): string | null {
  if (typeof document !== "undefined") {
    try {
      const ls = localStorage.getItem("csrf_token");
      if (ls) return ls;
    } catch {}
  }
  return null;
}

async function ensureCsrfToken(): Promise<string | null> {
  const existing = getCsrfToken();
  if (existing) return existing;
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`${BASE_URL}/csrf-token`, { method: "GET", mode: "cors", credentials: "include" });
    const json = await res.json().catch(() => ({}));
    const token = json?.csrf_token;
    if (typeof token === "string" && token.length > 0) {
      try { localStorage.setItem("csrf_token", token); } catch {}
      return token;
    }
  } catch {}
  return null;
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
  const method = (init.method || "GET").toUpperCase();
  if (method !== "GET") {
    const csrf = await ensureCsrfToken();
    if (csrf) headers["X-CSRF-Token"] = csrf;
  }

  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const res = await fetch(url, { ...init, headers, mode: "cors", credentials: "include" });

      if (res.status === 401) {
        // Try silent refresh using refresh_token before redirecting
        try {
          const refresh = typeof document !== "undefined" ? localStorage.getItem("refresh_token") : null;
          const payloadRaw = token || "";
          let sub: number | null = null;
          try {
            const part = (payloadRaw.split(".")[1] || "");
            const raw = typeof window !== "undefined" ? atob(part) : Buffer.from(part, "base64").toString();
            const json = JSON.parse(raw);
            const subVal = json?.sub;
            sub = typeof subVal === "number" ? subVal : (typeof subVal === "string" ? parseInt(subVal, 10) : null);
          } catch {}

          if (refresh && sub) {
            if (!refreshing) {
              refreshing = (async () => {
                const r = await fetch(`${BASE_URL}/auth/refresh`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  mode: "cors",
                  credentials: "include",
                  body: JSON.stringify({ user_id: sub, refresh_token: refresh }),
                });
                const b = await r.json().catch(() => ({}));
                if (!r.ok || b?.success === false) return null;
                const na = b?.data?.access_token || b?.access_token;
                const nr = b?.data?.refresh_token || b?.refresh_token;
                if (typeof nr === "string" && nr.length > 0) {
                  try { localStorage.setItem("refresh_token", nr); } catch {}
                }
                return typeof na === "string" && na.length > 0 ? na : null;
              })().finally(() => { refreshing = null; });
            }
            const newAccess = await refreshing;
            if (newAccess) {
              setToken(newAccess);
              headers["Authorization"] = `Bearer ${newAccess}`;
              const retryRes = await fetch(url, { ...init, headers, mode: "cors", credentials: "include" });
              const retryBody = await parseResponse<T>(retryRes);
              if (!retryRes.ok || retryBody.success === false) {
                let msg = retryBody.error?.message || retryBody.message || retryRes.statusText;
                if (retryRes.status === 403) msg = "No permission";
                if (retryRes.status === 429) msg = "Too Many Requests";
                const errObj = new Error(msg) as Error & { code?: string; details?: unknown; status?: number };
                errObj.code = retryBody.error?.code || String(retryRes.status);
                errObj.details = retryBody.error?.details;
                errObj.status = retryRes.status;
                throw errObj;
              }
              return retryBody.data as T;
            }
          }
        } catch {}
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
        const errObj = new Error(msg) as Error & { code?: string; details?: unknown; status?: number };
        errObj.code = body.error?.code || String(res.status);
        errObj.details = body.error?.details;
        errObj.status = res.status;
        throw errObj;
      }

      return body.data as T;
    } catch (e) {
      if (e instanceof TypeError) {
        throw new Error("Network error: failed to reach API server. Check API URL or device connectivity.", { cause: e });
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

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message?: string }> };

export async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const url = `${BASE_URL}/graphql`;
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const csrf = await ensureCsrfToken();
  if (csrf) headers["X-CSRF-Token"] = csrf;
  const res = await fetch(url, {
    method: "POST",
    headers,
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });
  const body = (await res.json().catch(() => ({}))) as GraphQLResponse<T>;
  if (!res.ok || Array.isArray(body.errors)) {
    const msg = body.errors?.[0]?.message || res.statusText;
    throw new Error(msg);
  }
  return body.data as T;
}
