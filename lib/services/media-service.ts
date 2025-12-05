import { api, getBaseUrl } from "@/lib/api-client";
import type { Meta } from "@/types/api-response";
import type { MediaFile, MediaFolder } from "@/types/backend-models";

const BASE_URL = getBaseUrl();

export interface UploadResult {
  uploaded: number;
  failed: number;
  files: MediaFile[];
  errors?: Array<{ filename: string; error: string }>;
}

async function uploadForm(path: string, form: FormData): Promise<any> {
  const token = api.getToken() ?? "";
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    const msg = body.error?.message || body.message || res.statusText;
    throw new Error(msg);
  }
  return body.data ?? body;
}

export const mediaService = {
  async listFolders(): Promise<MediaFolder[]> {
    return api.get<MediaFolder[]>("/media/folders");
  },

  async createFolder(payload: { name: string; parent_id?: number }): Promise<MediaFolder> {
    return api.post<MediaFolder>("/media/folders", payload);
  },

  async stats(): Promise<any> {
    return api.get<any>("/media/stats");
  },

  async list(params: { page?: number; limit?: number; type?: string; folder?: string; search?: string } = {}): Promise<{ media: MediaFile[]; meta: Meta }> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.type) query.append("type", params.type);
    if (params.folder) query.append("folder", params.folder);
    if (params.search) query.append("search", params.search);

    const res = await fetch(`${getBaseUrl()}/media?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { media: (body.data as MediaFile[]) || [], meta: body.meta || {} };
  },

  async search(q: string, params: { page?: number; limit?: number } = {}): Promise<{ media: MediaFile[]; meta: Meta }> {
    const query = new URLSearchParams();
    query.append("q", q);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${getBaseUrl()}/media/search?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { media: (body.data as MediaFile[]) || [], meta: body.meta || {} };
  },

  async getById(id: number): Promise<MediaFile> {
    return api.get<MediaFile>(`/media/${id}`);
  },

  async update(id: number, payload: { alt?: string; caption?: string; folder?: string; tags?: string[] }): Promise<MediaFile> {
    return api.put<MediaFile>(`/media/${id}`, payload);
  },

  async remove(id: number): Promise<void> {
    await api.delete<void>(`/media/${id}`);
  },

  async upload(file: File, metadata: { folder?: string; alt?: string; caption?: string; tags?: string[] } = {}): Promise<MediaFile> {
    const form = new FormData();
    form.append("file", file);
    if (metadata.folder) form.append("folder", metadata.folder);
    if (metadata.alt) form.append("alt", metadata.alt);
    if (metadata.caption) form.append("caption", metadata.caption);
    if (metadata.tags) form.append("tags", JSON.stringify(metadata.tags));
    const data = await uploadForm("/media/upload", form);
    return data as MediaFile;
  },

  async bulkUpload(files: File[], folder?: string): Promise<UploadResult> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    if (folder) form.append("folder", folder);
    const data = await uploadForm("/media/bulk-upload", form);
    return data as UploadResult;
  },
};
