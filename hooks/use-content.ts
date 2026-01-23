"use client";
import { useEffect, useState, useCallback } from "react";
import { contentService, CreateContentTypePayload, UpdateContentTypePayload, AddFieldPayload } from "@/lib/services/content-service";
import { workflowService } from "@/lib/services/workflow-service";
import { ContentType, ContentField, ContentEntry } from "@/types/backend-models";

export function useContentTypes(projectId?: number) {
  const [data, setData] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cts = await contentService.listContentTypes(projectId);
      setData(cts);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to load content types");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

export function useContentType(id: number, projectId?: number) {
  const [data, setData] = useState<ContentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ct = await contentService.getContentType(id, projectId);
      setData(ct);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to load content type");
    } finally {
      setLoading(false);
    }
  }, [id, projectId]);

  useEffect(() => { if (id) refetch(); }, [id, projectId, refetch]);

  return { data, loading, error, refetch };
}

export function useEntries(contentTypeId: number, params?: { page?: number; limit?: number; status?: string; project_id?: number }) {
  const [data, setData] = useState<ContentEntry[]>([]);
  const [meta, setMeta] = useState<{ page?: number; limit?: number; total?: number; total_pages?: number }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contentService.listEntries(contentTypeId, params);
      let list = res.entries;
      const m = res.meta;
      if (!list || list.length === 0) {
        const wf = await workflowService.entriesByStatus(contentTypeId, params?.status, params?.project_id);
        list = wf || [];
      }
      setData(list);
      setMeta(m);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      try {
        const wf = await workflowService.entriesByStatus(contentTypeId, params?.status, params?.project_id);
        setData(wf || []);
        setMeta({});
        setError(null);
      } catch {
        setError(msg || "Failed to load entries");
      }
    } finally {
      setLoading(false);
    }
  }, [contentTypeId, params]);

  useEffect(() => { if (contentTypeId) refetch(); }, [contentTypeId, refetch]);

  return { data, meta, loading, error, refetch };
}

export const contentActions = {
  createContentType: (payload: CreateContentTypePayload) => contentService.createContentType(payload),
  updateContentType: (id: number, payload: UpdateContentTypePayload) => contentService.updateContentType(id, payload),
  deleteContentType: (id: number) => contentService.deleteContentType(id),
  addField: (contentTypeId: number, payload: AddFieldPayload, projectId?: number) => contentService.addField(contentTypeId, payload, projectId),
  updateField: (contentTypeId: number, fieldId: number, payload: Partial<AddFieldPayload>, projectId?: number) => contentService.updateField(fieldId, payload, contentTypeId, projectId),
  deleteField: (contentTypeId: number, fieldId: number, projectId?: number) => contentService.deleteField(fieldId, contentTypeId, projectId),
  createEntry: (contentTypeId: number, payload: { data: Record<string, unknown> }) => contentService.createEntry(contentTypeId, payload),
  updateEntry: (entryId: number, data: Record<string, unknown>) => contentService.updateEntry(entryId, data),
  deleteEntry: (entryId: number) => contentService.deleteEntry(entryId),
};
