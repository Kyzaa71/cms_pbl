import { api, getBaseUrl } from "@/lib/api-client";
import type { Meta } from "@/types/api-response";
import type { ContentEntry as BackendEntry } from "@/types/backend-models";

const BASE_URL = getBaseUrl();

export interface FullTextParams {
  q: string;
  page?: number;
  limit?: number;
  project_id?: number;
}

export interface AdvancedParams {
  query?: string;
  content_type_ids?: number[];
  fields?: string[];
  status?: string;
  created_by?: number;
  tags?: string[];
  from_date?: string;
  to_date?: string;
  sort_by?: "created_at" | "updated_at" | "published_at" | "title";
  order_by?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  entries: BackendEntry[];
  meta: Meta;
}

export interface FacetsResponse {
  content_types: Record<string, number>;
  statuses: Record<string, number>;
  date_range?: { oldest: string; newest: string };
}

export const searchService = {
  async fullText(params: FullTextParams): Promise<SearchResponse> {
    const query = new URLSearchParams();
    query.append("q", params.q);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.project_id) query.append("project_id", String(params.project_id));

    const res = await fetch(`${getBaseUrl()}/search/entries?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { entries: (body.data as BackendEntry[]) || [], meta: body.meta || {} };
  },

  async advanced(params: AdvancedParams): Promise<SearchResponse> {
    const res = await fetch(`${getBaseUrl()}/search/advanced`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
      body: JSON.stringify(params),
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { entries: (body.data as BackendEntry[]) || [], meta: body.meta || {} };
  },

  async facets(params: { q?: string; content_type_ids?: number[] }): Promise<FacetsResponse> {
    const query = new URLSearchParams();
    if (params.q) query.append("q", params.q);
    if (params.content_type_ids && params.content_type_ids.length > 0) {
      query.append("content_type_ids", params.content_type_ids.join(","));
    }
    const res = await fetch(`${getBaseUrl()}/search/facets?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return (body.data as FacetsResponse) || { content_types: {}, statuses: {} as Record<string, number> };
  },

  async autocomplete(params: { field: string; prefix: string; content_type_id: number; limit?: number }): Promise<string[]> {
    const query = new URLSearchParams();
    query.append("field", params.field);
    query.append("prefix", params.prefix);
    query.append("content_type_id", String(params.content_type_id));
    if (params.limit) query.append("limit", String(params.limit));
    const res = await fetch(`${getBaseUrl()}/search/autocomplete?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return (body.data as string[]) || [];
  },

  async stats(): Promise<Record<string, unknown>> {
    return api.get<Record<string, unknown>>("/search/stats");
  },

  async related(entryId: number, type: string): Promise<BackendEntry[]> {
    const res = await api.get<BackendEntry[]>(`/search/entries/${entryId}/related?type=${type}`);
    return res || [];
  },
};
