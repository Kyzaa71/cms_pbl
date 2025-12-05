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
   * Create entry with field data
   * IMPORTANT: Send field data DIRECTLY, NOT wrapped in { data: {...} }
   * Backend expects: { "field1": value1, "field2": value2, ... }
   */
  async createEntry(contentTypeId: number, fieldData: Record<string, unknown>): Promise<ContentEntry> {
    // Send field data directly - backend will extract by field names
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
  
  async listEntries(
    contentTypeId: number,
    params: { page?: number; limit?: number; status?: string; created_by?: number; from?: string; to?: string } = {}
  ): Promise<{ entries: ContentEntry[]; meta: Meta }> {
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
    const body = (await res.json()) as StandardResponse<ContentEntry[]>;
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { entries: body.data || [], meta: body.meta || {} };
  },
};
