import { api, request, getBaseUrl } from "@/lib/api-client";
import { ContentType, ContentField, ContentEntry } from "@/types/backend-models";
import { StandardResponse, Meta } from "@/types/api-response";

export type CreateContentTypePayload = { name: string; slug: string };
export type UpdateContentTypePayload = { name: string; slug: string; enable_seo: boolean };

export type AddFieldPayload = {
  name: string;
  type: string;
  required: boolean;
  is_seo: boolean;
  unique?: boolean;
  max_length?: number;
  min_length?: number;
  pattern?: string;
  min_value?: number;
  max_value?: number;
  default_value?: string;
  placeholder?: string;
  help_text?: string;
};

export const contentService = {
  async listContentTypes(): Promise<ContentType[]> {
    return api.get<ContentType[]>("/content/types");
  },
  async getContentType(id: number): Promise<ContentType> {
    return api.get<ContentType>(`/content/types/${id}`);
  },
  async createContentType(payload: CreateContentTypePayload): Promise<ContentType> {
    return api.post<ContentType>("/content/types", payload);
  },
  async updateContentType(id: number, payload: UpdateContentTypePayload): Promise<ContentType> {
    return api.put<ContentType>(`/content/types/${id}`, payload);
  },
  async deleteContentType(id: number): Promise<void> {
    await api.delete<void>(`/content/types/${id}`);
  },

  async addField(contentTypeId: number, payload: AddFieldPayload): Promise<ContentField> {
    return api.post<ContentField>(`/content/types/${contentTypeId}/fields`, payload);
  },
  async updateField(fieldId: number, payload: Partial<AddFieldPayload>): Promise<ContentField> {
    return api.put<ContentField>(`/content/fields/${fieldId}`, payload);
  },
  async deleteField(fieldId: number): Promise<void> {
    await api.delete<void>(`/content/fields/${fieldId}`);
  },

  /**
   * Create entry - CRITICAL: Send field data DIRECTLY as top-level properties
   * 
   * Backend expects: { "title": "...", "body": "...", "featured_image_media_id": 123 }
   * NOT: { data: { "title": "..." } }
   * 
   * The backend loops through content type fields and extracts payload[field.name]
   * so field names MUST be at the top level of the request body.
   */
  async createEntry(contentTypeId: number, fieldData: Record<string, unknown>): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/content/${contentTypeId}/entries`, fieldData);
  },
  async getEntry(entryId: number): Promise<ContentEntry> {
    return api.get<ContentEntry>(`/content/entries/${entryId}`);
  },
  async updateEntry(entryId: number, data: Record<string, unknown>): Promise<ContentEntry> {
    return api.put<ContentEntry>(`/content/entries/${entryId}`, data);
  },
  async deleteEntry(entryId: number): Promise<void> {
    await api.delete<void>(`/content/entries/${entryId}`);
  },
  async translateEntry(entryId: number, payload: { target_lang: string }): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/content/entries/${entryId}/translate`, payload);
  },
  async seoPreview(entryId: number): Promise<Record<string, unknown>> {
    return api.get<Record<string, unknown>>(`/content/entries/${entryId}/seo-preview`);
  },
  async listEntries(contentTypeId: number, params: { page?: number; limit?: number; status?: string; created_by?: number; from?: string; to?: string } = {}): Promise<{ entries: ContentEntry[]; meta: Meta }> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.status) query.append("status", params.status);
    if (params.created_by) query.append("created_by", String(params.created_by));
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);

    const res = await fetch(`${getBaseUrl()}/content/${contentTypeId}/entries?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const raw: unknown = await res.json();
    // Support multiple response shapes: array, StandardResponse with data: [], or data: { entries, meta }
    let entries: ContentEntry[] = [];
    let meta: Meta = {};

    if (Array.isArray(raw)) {
      entries = raw as ContentEntry[];
    } else {
      const body = raw as StandardResponse<ContentEntry[] | { entries: ContentEntry[]; meta?: Meta }>;
      if (!res.ok || body.success === false) {
        throw new Error(body.error?.message || body.message || res.statusText);
      }
      const data = body.data;
      if (Array.isArray(data)) {
        entries = data;
        meta = body.meta || {};
      } else if (data && typeof data === "object" && "entries" in data) {
        const obj = data as { entries: ContentEntry[]; meta?: Meta };
        entries = Array.isArray(obj.entries) ? obj.entries : [];
        meta = obj.meta || body.meta || {};
      } else {
        entries = [];
        meta = body.meta || {};
      }
    }
    return { entries, meta };
  },
  async apiReference(contentTypeId: number): Promise<Record<string, unknown>> {
    return api.get<Record<string, unknown>>(`/content/types/${contentTypeId}/api-reference`);
  },
  async openapi(contentTypeId: number): Promise<string> {
    const token = api.getToken() ?? "";
    const res = await fetch(`${getBaseUrl()}/content/types/${contentTypeId}/openapi`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text;
  },
  async markdownDocs(contentTypeId: number): Promise<string> {
    const token = api.getToken() ?? "";
    const res = await fetch(`${getBaseUrl()}/content/types/${contentTypeId}/docs/markdown`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text;
  },
};
