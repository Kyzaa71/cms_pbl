import { api } from "@/lib/api-client";
import { WorkflowComment, WorkflowHistory, WorkflowAssignment, ContentEntry, User } from "@/types/backend-models";

export const workflowService = {
  async changeStatus(entryId: number, payload: { status: string; comment?: string }): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/workflow/entries/${entryId}/status`, payload);
  },
  async requestReview(entryId: number, payload: { comment?: string }): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/workflow/entries/${entryId}/request-review`, payload);
  },
  async approve(entryId: number, payload: { comment?: string }): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/workflow/entries/${entryId}/approve`, payload);
  },
  async reject(entryId: number, payload: { comment: string }): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/workflow/entries/${entryId}/reject`, payload);
  },
  async publish(entryId: number, payload: { comment?: string }): Promise<ContentEntry> {
    return api.post<ContentEntry>(`/workflow/entries/${entryId}/publish`, payload);
  },
  async history(entryId: number): Promise<WorkflowHistory[]> {
    return api.get<WorkflowHistory[]>(`/workflow/entries/${entryId}/history`);
  },
  async addComment(entryId: number, payload: { comment: string; is_private?: boolean }): Promise<WorkflowComment> {
    return api.post<WorkflowComment>(`/workflow/entries/${entryId}/comments`, payload);
  },
  async comments(entryId: number, includePrivate = false): Promise<WorkflowComment[]> {
    return api.get<WorkflowComment[]>(`/workflow/entries/${entryId}/comments?include_private=${includePrivate}`);
  },
  async assign(entryId: number, payload: { assigned_to: number; due_date?: string; auto_transition_to_draft?: boolean }): Promise<WorkflowAssignment> {
    return api.post<WorkflowAssignment>(`/workflow/entries/${entryId}/assign`, payload);
  },
  async myAssignments(status?: string): Promise<WorkflowAssignment[]> {
    const qs = status ? `?status=${status}` : "";
    return api.get<WorkflowAssignment[]>(`/workflow/assignments${qs}`);
  },
  async getActiveAssignment(entryId: number): Promise<WorkflowAssignment | null> {
    return api.get<WorkflowAssignment | null>(`/workflow/entries/${entryId}/active-assignment`);
  },
  async getAssignees(projectId?: number): Promise<User[]> {
    const qs = projectId && projectId > 0 ? `?project_id=${projectId}` : "";
    return api.get<User[]>(`/workflow/assignees${qs}`);
  },
  async completeAssignment(assignmentId: number, requestReview?: boolean): Promise<void> {
    await api.put<void>(`/workflow/assignments/${assignmentId}/complete`, { request_review: requestReview });
  },
  async entriesByStatus(contentTypeId: number, status?: string, projectId?: number): Promise<ContentEntry[]> {
    const query = new URLSearchParams();
    if (status) query.append("status", status);
    if (projectId) query.append("project_id", String(projectId));
    const qs = query.toString();
    return api.get<ContentEntry[]>(`/workflow/content-types/${contentTypeId}/entries${qs ? `?${qs}` : ""}`);
  },
  async stats(contentTypeId: number): Promise<Record<string, unknown>> {
    return api.get<Record<string, unknown>>(`/workflow/content-types/${contentTypeId}/stats`);
  },
};
