import { api, getBaseUrl } from "@/lib/api-client";
import type { Meta } from "@/types/api-response";
import type { MediaFile, MediaFolder } from "@/types/backend-models";

// removed unused BASE_URL

export interface UploadResult {
  uploaded: number;
  failed: number;
  files: MediaFile[];
  errors?: Array<{ filename: string; error: string }>;
}

/**
 * Get the base path for media API based on project context
 * - Global media: /media
 * - Project media: /projects/{id}/media
 */
function getMediaBasePath(projectId?: number): string {
  if (projectId && Number.isFinite(projectId) && projectId > 0) {
    return `/projects/${projectId}/media`;
  }
  return "/media";
}

async function uploadForm(path: string, form: FormData): Promise<unknown> {
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

function inferProjectId(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("project_id");
    const fromQuery = q ? Number(q) : NaN;
    if (Number.isFinite(fromQuery) && fromQuery > 0) return fromQuery;
    const m = url.pathname.match(/\/organizational\/(\d+)\/workspace/i);
    if (m && m[1]) {
      const v = Number(m[1]);
      if (Number.isFinite(v) && v > 0) return v;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export const mediaService = {
  async listFolders(projectId?: number): Promise<MediaFolder[]> {
    const basePath = getMediaBasePath(projectId);
    return api.get<MediaFolder[]>(`${basePath}/folders`);
  },

  async createFolder(payload: { name: string; parent_id?: number; project_id?: number }): Promise<MediaFolder> {
    const basePath = getMediaBasePath(payload.project_id);
    return api.post<MediaFolder>(`${basePath}/folders`, payload);
  },

  async stats(projectId?: number): Promise<Record<string, unknown>> {
    const basePath = getMediaBasePath(projectId);
    return api.get<Record<string, unknown>>(`${basePath}/stats`);
  },

  /**
   * List media files
   * - Global: GET /media/
   * - Project: GET /projects/{id}/media/
   */
  async list(params: { page?: number; limit?: number; type?: string; folder?: string; search?: string; project_id?: number } = {}): Promise<{ media: MediaFile[]; meta: Meta }> {
    const basePath = getMediaBasePath(params.project_id);
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.type) query.append("type", params.type);
    if (params.folder) query.append("folder", params.folder);
    if (params.search) query.append("search", params.search);

    const queryStr = query.toString();
    const url = `${getBaseUrl()}${basePath}/${queryStr ? `?${queryStr}` : ""}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { media: (body.data as MediaFile[]) || [], meta: body.meta || {} };
  },

  /**
   * Search media files
   * - Global: GET /media/search?q=keyword
   * - Project: GET /projects/{id}/media/search?q=keyword
   */
  async search(q: string, params: { page?: number; limit?: number; project_id?: number } = {}): Promise<{ media: MediaFile[]; meta: Meta }> {
    const basePath = getMediaBasePath(params.project_id);
    const query = new URLSearchParams();
    query.append("q", q);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${getBaseUrl()}${basePath}/search?${query.toString()}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${api.getToken() ?? ""}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(body.error?.message || body.message || res.statusText);
    }
    return { media: (body.data as MediaFile[]) || [], meta: body.meta || {} };
  },

  async getById(id: number, projectId?: number): Promise<MediaFile> {
    const pid = projectId ?? inferProjectId();
    const basePath = getMediaBasePath(pid);
    return api.get<MediaFile>(`${basePath}/${id}`);
  },

  async update(id: number, payload: { alt?: string; caption?: string; folder?: string; tags?: string[] }, projectId?: number): Promise<MediaFile> {
    const pid = projectId ?? inferProjectId();
    const basePath = getMediaBasePath(pid);
    return api.put<MediaFile>(`${basePath}/${id}`, payload);
  },

  async remove(id: number, projectId?: number): Promise<void> {
    const pid = projectId ?? inferProjectId();
    const basePath = getMediaBasePath(pid);
    await api.delete<void>(`${basePath}/${id}`);
  },

  /**
   * Upload single media file
   * - Global: POST /media/upload
   * - Project: POST /projects/{id}/media/upload
   */
  async upload(file: File, metadata: { folder?: string; alt?: string; caption?: string; tags?: string[]; project_id?: number } = {}): Promise<MediaFile> {
    const form = new FormData();
    form.append("file", file);
    if (metadata.folder) form.append("folder", metadata.folder);
    if (metadata.alt) form.append("alt", metadata.alt);
    if (metadata.caption) form.append("caption", metadata.caption);
    if (metadata.tags) form.append("tags", JSON.stringify(metadata.tags));
    const pid = metadata.project_id ?? inferProjectId();
    const basePath = getMediaBasePath(pid);
    const data = await uploadForm(`${basePath}/upload`, form);
    return data as MediaFile;
  },

  /**
   * Bulk upload media files
   * - Global: POST /media/bulk-upload
   * - Project: POST /projects/{id}/media/bulk-upload
   */
  async bulkUpload(files: File[], folder?: string, projectId?: number): Promise<UploadResult> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    if (folder) form.append("folder", folder);
    const pid = projectId ?? inferProjectId();
    const basePath = getMediaBasePath(pid);
    const data = await uploadForm(`${basePath}/bulk-upload`, form);
    return data as UploadResult;
  },
};
