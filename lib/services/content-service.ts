import { api, request, getBaseUrl } from "@/lib/api-client";
import { ContentType, ContentField, ContentEntry } from "@/types/backend-models";
import { StandardResponse, Meta } from "@/types/api-response";

export type CreateContentTypePayload = { name: string; slug: string; project_id?: number };
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
  async listContentTypes(projectId?: number): Promise<ContentType[]> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return api.get<ContentType[]>(`/content/types${qs}`);
  },
  async getContentType(id: number, projectId?: number): Promise<ContentType> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return api.get<ContentType>(`/content/types/${id}${qs}`);
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

  async addField(contentTypeId: number, payload: AddFieldPayload, projectId?: number): Promise<ContentField> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return api.post<ContentField>(`/content/types/${contentTypeId}/fields${qs}`, payload);
  },
  async updateField(fieldId: number, payload: Partial<AddFieldPayload>, contentTypeId?: number, projectId?: number): Promise<ContentField> {
    if (contentTypeId) {
      try {
        const qs = projectId ? `?project_id=${projectId}` : "";
        return await api.put<ContentField>(`/content/types/${contentTypeId}/fields/${fieldId}${qs}`, payload);
      } catch (e: unknown) {
        const obj = (e as Record<string, unknown>) || {};
        const rawCode = obj && typeof obj === "object" && "code" in obj ? (obj as Record<string, unknown>).code : undefined;
        const code = typeof rawCode === "number" ? String(rawCode) : typeof rawCode === "string" ? rawCode : "";
        const rawMsg = obj && typeof obj === "object" && "message" in obj ? (obj as Record<string, unknown>).message : undefined;
        const msg = typeof rawMsg === "string" ? rawMsg : "";
        if (code === "404" || /not\s*found/i.test(msg)) {
          try {
            return await api.put<ContentField>(`/content/types/${contentTypeId}/fields/${fieldId}`, payload);
          } catch {
            // continue to fallback below
          }
          try {
            const qs2 = projectId ? `?project_id=${projectId}` : "";
            return await api.put<ContentField>(`/content/${contentTypeId}/fields/${fieldId}${qs2}`, payload);
          } catch {
            try {
              return await api.put<ContentField>(`/content/${contentTypeId}/fields/${fieldId}`, payload);
            } catch {
              // continue to next fallback
            }
          }
        } else {
          // Try PATCH method for method-sensitive backends
          try {
            const qs = projectId ? `?project_id=${projectId}` : "";
            return await request<ContentField>(`/content/types/${contentTypeId}/fields/${fieldId}${qs}`, {
              method: "PATCH",
              body: JSON.stringify(payload),
            });
          } catch {
            // Continue to legacy fallback below
          }
          throw e;
        }
      }
    }
    try {
      return await api.put<ContentField>(`/content/fields/${fieldId}`, payload);
    } catch {
      // Legacy PATCH fallback
      try {
        return await request<ContentField>(`/content/fields/${fieldId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } catch (legacyErr: unknown) {
        throw legacyErr;
      }
    }
  },
  async deleteField(fieldId: number, contentTypeId?: number, projectId?: number): Promise<void> {
    if (contentTypeId) {
      const qs = projectId ? `?project_id=${projectId}` : "";
      try {
        await api.delete<void>(`/content/types/${contentTypeId}/fields/${fieldId}${qs}`);
        return;
      } catch {
        try {
          await api.delete<void>(`/content/types/${contentTypeId}/fields/${fieldId}`);
          return;
        } catch {
          // try route without "types" segment (be_new)
          try {
            await api.delete<void>(`/content/${contentTypeId}/fields/${fieldId}${qs}`);
            return;
          } catch {
            try {
              await api.delete<void>(`/content/${contentTypeId}/fields/${fieldId}`);
              return;
            } catch {
              // continue to legacy fallback below
            }
          }
        }
      }
    }
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
  async createEntry(contentTypeId: number, fieldData: Record<string, unknown>, projectId?: number): Promise<ContentEntry> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return api.post<ContentEntry>(`/content/${contentTypeId}/entries${qs}`, fieldData);
  },
  async getEntry(entryId: number, projectId?: number): Promise<ContentEntry> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return api.get<ContentEntry>(`/content/entries/${entryId}${qs}`);
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
  async previewToken(entryId: number): Promise<{ token: string; expires_at: string; preview_url?: string; frontend_preview_url?: string }> {
    return api.post<{ token: string; expires_at: string; preview_url?: string; frontend_preview_url?: string }>(`/content/entries/${entryId}/preview-token`);
  },
  async previewEntry(entryId: number, token: string): Promise<ContentEntry> {
    const url = `${getBaseUrl()}/content/entries/${entryId}/preview?token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { method: "GET" });
    const body = await res.json();
    if (!res.ok || body?.success === false) {
      throw new Error(body?.error?.message || body?.message || res.statusText);
    }
    return body?.data as ContentEntry;
  },
  async listEntries(contentTypeId: number, params: { page?: number; limit?: number; status?: string; created_by?: number; from?: string; to?: string; project_id?: number } = {}): Promise<{ entries: ContentEntry[]; meta: Meta }> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.status) query.append("status", params.status);
    if (params.created_by) query.append("created_by", String(params.created_by));
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);
    if (params.project_id) query.append("project_id", String(params.project_id));

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
