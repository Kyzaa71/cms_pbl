"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Eye,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  SendToBack,
} from "lucide-react";
import { getInitials, getAvailableTransitions, isValidTransition } from "@/components/workflow-management/types";
import { workflowService } from "@/lib/services/workflow-service";
import { contentService } from "@/lib/services/content-service";
import { useContentTypes } from "@/hooks/use-content";
import { ContentEntry } from "@/types/backend-models";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { StatusTransitionModal } from "@/components/workflow-management/status-transition-modal";
import type { User, WorkflowHistory } from "@/types/backend-models";
import type { WorkflowStatus } from "@/components/workflow-management/types";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { projectService } from "@/lib/services/project-service";
 

export default function WorkflowManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("project_id");
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  const { can, user, getCurrentUser, token } = useAuth();
  const { data: contentTypes, loading: ctLoading } = useContentTypes(projectId);
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [creators, setCreators] = useState<Record<number, User>>({});
  const [actionUsers, setActionUsers] = useState<Record<number, User | null>>({});
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [selectedToStatus, setSelectedToStatus] = useState<WorkflowStatus | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [previewingId, setPreviewingId] = useState<number | null>(null);
  const roleName = (() => {
    let r = "";
    let tk: string | null = null;
    if (typeof document !== "undefined") {
      try { tk = localStorage.getItem("auth_token"); } catch {}
    }
    if (!tk) tk = typeof token === "string" ? token : api.getToken();
    if (typeof tk === "string") {
      try {
        const part = tk.split(".")[1] || "";
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        const padded = base64 + (pad ? "=".repeat(4 - pad) : "");
        const payload = padded ? JSON.parse(atob(padded)) : {};
        if (payload && typeof payload.role === "string") r = (payload.role as string).toLowerCase().trim();
      } catch {}
    }
    if (!r) r = ((user?.role?.name || "").toLowerCase().trim());
    return r || "viewer";
  })();
  const [projectRoleName, setProjectRoleName] = useState<string>("");
  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!projectId || !user?.id) { setProjectRoleName(""); return; }
      try {
        const members = await projectService.getProjectMembers(projectId);
        const me = members.find((m) => m.user_id === user.id);
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    fetchRole();
    return () => { active = false; };
  }, [projectId, user?.id]);
  const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const globalRoleKey = (roleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const orgCanTransition = (from: WorkflowStatus, to: WorkflowStatus): boolean => {
    const mapProjectRole = (key: string): string => {
      if (key === "projectadmin") return "admin";
      if (key === "projectowner") return "manager";
      if (key === "projecteditor") return "editor";
      if (key === "projectviewer") return "viewer";
      if (key === "projectcontentwriter") return "content_writer";
      return "";
    };
    const normalizeGlobal = (key: string): string => {
      if (key === "contentwriter") return "content_writer";
      return key;
    };
    const role = (() => {
      const proj = mapProjectRole(projectRoleKey);
      if (proj) return proj;
      return normalizeGlobal(globalRoleKey);
    })();
    return isValidTransition(from, to, role);
  };

  // Removed auto-refresh of current user to avoid excessive /auth/refresh calls

  useEffect(() => {
    const load = async () => {
      if (ctLoading) return;
      setEntriesLoading(true);
      setEntries([]);
      try {
        if (contentTypeFilter !== "all") {
          const ctId = parseInt(contentTypeFilter);
          const list = await workflowService.entriesByStatus(ctId, statusFilter === "all" ? undefined : statusFilter, projectId);
          setEntries(list);
        } else if ((contentTypes || []).length > 0) {
          const all: ContentEntry[] = [];
          for (const ct of contentTypes!) {
            const list = await workflowService.entriesByStatus(ct.id, statusFilter === "all" ? undefined : statusFilter, projectId);
            all.push(...list);
          }
          setEntries(all);
        }
      } finally {
        setEntriesLoading(false);
      }
    };
    load();
  }, [ctLoading, contentTypes, contentTypeFilter, statusFilter, projectId]);

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const obj = (typeof entry.data === "object" && entry.data) ? (entry.data as Record<string, unknown>) : {};
    const cands = ["title", "judul", "name", "meta_title"] as const;
    let title = "";
    for (const key of cands) {
      const v = obj[key];
      if (typeof v === "string" && v.trim().length > 0) { title = v; break; }
    }
    if (!title) {
      for (const v of Object.values(obj)) { if (typeof v === "string" && v.trim().length > 0) { title = v; break; } }
    }
    if (!title) title = `Entry #${entry.id}`;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesContentType = contentTypeFilter === "all" || String(entry.content_type_id) === contentTypeFilter;
    return matchesSearch && matchesStatus && matchesContentType;
  });

  useEffect(() => {
    const fillCreators = async () => {
      const need = filteredEntries.filter((e) => !e.creator).map((e) => e.id).filter((id) => !(id in creators));
      if (need.length === 0) return;
      const results = await Promise.allSettled(need.map((id) => contentService.getEntry(id)));
      const next: Record<number, User> = { ...creators };
      results.forEach((res, idx) => {
        const id = need[idx]!;
        if (res.status === "fulfilled" && res.value?.creator) {
          next[id] = res.value.creator as User;
        }
      });
      setCreators(next);
    };
    fillCreators();
  }, [filteredEntries]);

  useEffect(() => {
    const fillActionUsers = async () => {
      const needIds = filteredEntries.map((e) => e.id).filter((id) => !(id in actionUsers));
      if (needIds.length === 0) return;
      const histories = await Promise.allSettled(needIds.map((id) => workflowService.history(id)));
      const next: Record<number, User | null> = { ...actionUsers };
      for (let i = 0; i < histories.length; i++) {
        const res = histories[i]!;
        const id = needIds[i]!;
        if (res.status === "fulfilled") {
          const hs = res.value as WorkflowHistory[];
          const entry = filteredEntries.find((e) => e.id === id);
          const targetStatus = entry?.status;
          const match = hs.slice().reverse().find((h) => h.to_status === targetStatus) || (hs.length > 0 ? hs[hs.length - 1] : undefined);
          const actor: User | null = (match && match.user) ? match.user : null;
          next[id] = actor;
        } else {
          next[id] = null;
        }
      }
      setActionUsers(next);
    };
    fillActionUsers();
  }, [filteredEntries]);

  const handleRowStatusChange = (entryId: number, toStatus: WorkflowStatus) => {
    setSelectedEntryId(entryId);
    setSelectedToStatus(toStatus);
    setShowStatusModal(true);
  };

  const handleSubmitStatus = async (comment: string) => {
    if (!selectedEntryId || !selectedToStatus) return;
    const from = (((entries.find((e) => e.id === selectedEntryId)?.status || "draft") as string).toLowerCase().trim()) as WorkflowStatus;
    if (!orgCanTransition(from, selectedToStatus as WorkflowStatus)) {
      setShowStatusModal(false);
      setSelectedToStatus(null);
      setSelectedEntryId(null);
      return;
    }
    let updated: ContentEntry | null = null;
    try {
      if (selectedToStatus === "in_review") {
        updated = await workflowService.requestReview(selectedEntryId, { comment });
      } else if (selectedToStatus === "ready_for_approval") {
        updated = await workflowService.changeStatus(selectedEntryId, { status: "ready_for_approval", comment });
      } else if (selectedToStatus === "approved") {
        if (projectRoleKey === "projectowner" || projectRoleKey === "projectadmin") {
          updated = await workflowService.changeStatus(selectedEntryId, { status: "approved", comment });
        } else {
          updated = await workflowService.approve(selectedEntryId, { comment });
        }
      } else if (selectedToStatus === "published") {
        if (projectRoleKey === "projectowner" || projectRoleKey === "projectadmin") {
          updated = await workflowService.changeStatus(selectedEntryId, { status: "published", comment });
        } else {
          updated = await workflowService.publish(selectedEntryId, { comment });
        }
      } else if (selectedToStatus === "rejected") {
        if (from === "ready_for_approval") {
          updated = await workflowService.reject(selectedEntryId, { comment });
        } else {
          updated = await workflowService.changeStatus(selectedEntryId, { status: "rejected", comment });
        }
      } else {
        updated = await workflowService.changeStatus(selectedEntryId, { status: selectedToStatus, comment });
      }
      if (updated) {
        setEntries((prev) => prev.map((e) => (e.id === updated!.id ? updated! : e)));
      }
    } finally {
      setShowStatusModal(false);
      setSelectedToStatus(null);
      setSelectedEntryId(null);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: entries.length,
    draft: entries.filter((e) => e.status === "draft").length,
    inReview: entries.filter((e) => e.status === "in_review").length,
    readyForApproval: entries.filter((e) => e.status === "ready_for_approval").length,
    approved: entries.filter((e) => e.status === "approved").length,
    published: entries.filter((e) => e.status === "published").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  }), [entries]);

  const handleView = (entryId: number) => {
    if (projectId) {
      router.push(`/organizational/${projectId}/workspace/workflow/${entryId}?project_id=${projectId}`);
    } else {
      router.push(`/workflow-management/${entryId}`);
    }
  };

  const handlePreview = async (entryId: number) => {
    try {
      setPreviewingId(entryId);
      const { token } = await contentService.previewToken(entryId);
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const target = `${origin}/preview?entry_id=${entryId}&token=${encodeURIComponent(token)}`;
      window.open(target, "_blank", "noopener,noreferrer");
    } catch (e) {
      alert((e as Error)?.message || "Failed to open preview");
    } finally {
      setPreviewingId(null);
    }
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Workflow Management
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage content workflow, approvals, and status transitions
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={projectId ? `/organizational/${projectId}/workspace/workflow/statistics?project_id=${projectId}` : "/workflow-management/statistics"}>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Statistics
            </Button>
          </Link>
          <Link href={projectId ? `/organizational/${projectId}/workspace/workflow/assignments?project_id=${projectId}` : "/workflow-management/assignments"}>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              My Assignments
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Draft</p>
              <p className="text-2xl font-bold mt-1">{stats.draft}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">In Review</p>
              <p className="text-2xl font-bold mt-1">{stats.inReview}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ready</p>
              <p className="text-2xl font-bold mt-1">{stats.readyForApproval}</p>
            </div>
            <SendToBack className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Approved</p>
              <p className="text-2xl font-bold mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Published</p>
              <p className="text-2xl font-bold mt-1">{stats.published}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected</p>
              <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="ready_for_approval">Ready for Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Type Filter */}
          <Select
            value={contentTypeFilter}
            onValueChange={setContentTypeFilter}
          >
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content Types</SelectItem>
              {(contentTypes || []).map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Entries Table */}
      {entriesLoading ? null : (
      <div className="overflow-x-auto border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="min-w-[800px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">Title</th>
              <th className="py-3 px-4 font-medium">Content Type</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Creator</th>
              <th className="py-3 px-4 font-medium">Last Updated</th>
              <th className="py-3 px-4 font-medium">Action By</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-t border-[var(--border)] ${
                    index % 2 === 0
                      ? "bg-[var(--card-bg-inner)]"
                      : "bg-[var(--card-bg)]"
                  } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-[var(--foreground)]">
                      {(() => {
                        const obj = (typeof entry.data === "object" && entry.data) ? (entry.data as Record<string, unknown>) : {};
                        const cands = ["title", "judul", "name", "meta_title"] as const;
                        for (const key of cands) {
                          const v = obj[key];
                          if (typeof v === "string" && v.trim().length > 0) return v as string;
                        }
                        for (const v of Object.values(obj)) { if (typeof v === "string" && v.trim().length > 0) return v; }
                        return `Entry #${entry.id}`;
                      })()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[var(--muted-foreground)]">
                      {(() => {
                        const id = entry.content_type_id;
                        const ct = (contentTypes || []).find((c) => c.id === id);
                        return ct ? ct.name : "";
                      })()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {(() => {
                            const user = creators[entry.id] ?? entry.creator ?? undefined;
                            const nm = (user?.name || "").replace(/[^A-Za-z ]/g, "");
                            return getInitials(nm || "Unknown");
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]" title={(() => {
                            const user = creators[entry.id] ?? entry.creator ?? undefined;
                            return user?.name || "Unknown";
                        })()}>
                          {(() => {
                            const user = creators[entry.id] ?? entry.creator ?? undefined;
                            return user?.name || "Unknown";
                          })()}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)] truncate max-w-[120px]" title={(() => {
                            const user = creators[entry.id] ?? entry.creator ?? undefined;
                            return user?.email || "";
                        })()}>
                          {(() => {
                            const user = creators[entry.id] ?? entry.creator ?? undefined;
                            return user?.email || "";
                          })()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] whitespace-nowrap">
                    {new Date(entry.updated_at || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {(() => {
                      const actor = actionUsers[entry.id];
                      if (!actor) return <span className="text-[var(--muted-foreground)]">-</span>;
                      const name = actor.name || "";
                      const email = actor.email || "";
                      return (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]" title={name}>{name || "-"}</span>
                            {email && <span className="text-xs text-[var(--muted-foreground)] truncate max-w-[120px]" title={email}>{email}</span>}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-end gap-2 flex-nowrap whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(entry.id)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)] shrink-0"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePreview(entry.id)}
                        className="!font-medium !text-xs !px-3 !py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in srgb, var(--primary) 85%, black)] shrink-0"
                        title="Preview Entry"
                        disabled={previewingId === entry.id}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      {(() => {
                        const status = ((entry.status || "") as string).toLowerCase().trim() as WorkflowStatus;
                        const allow = status === "draft" && orgCanTransition(status, "in_review");
                        return allow;
                      })() && (
                        <Button
                          size="sm"
                          onClick={() => handleRowStatusChange(entry.id, "in_review")}
                          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-blue-600 hover:!bg-blue-700 active:!bg-blue-800 !text-white !border-blue-600 hover:!border-blue-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
                        >
                          Request Review
                        </Button>
                      )}
                      {(() => {
                        const status = ((entry.status || "") as string).toLowerCase().trim() as WorkflowStatus;
                        const allow = status === "in_review" && orgCanTransition(status, "ready_for_approval");
                        return allow;
                      })() && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleRowStatusChange(entry.id, "ready_for_approval")}
                            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700 !text-white !border-orange-500 hover:!border-orange-600 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
                          >
                            Ready for Approval
                          </Button>
                          {(() => {
                            const status = ((entry.status || "") as string).toLowerCase().trim() as WorkflowStatus;
                            const allow = status === "in_review" && orgCanTransition(status, "rejected");
                            return allow;
                          })() && (
                          <Button
                            size="sm"
                            onClick={() => handleRowStatusChange(entry.id, "rejected")}
                            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--danger)] hover:!bg-[color-mix(in srgb, var(--danger) 85%, black)] active:!bg-[color-mix(in srgb, var(--danger) 75%, black)] !text-white !border-[var(--danger)] hover:!border-[color-mix(in srgb, var(--danger) 85%, black)] !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
                          >
                            Reject
                          </Button>
                          )}
                          {(() => {
                            const status = ((entry.status || "") as string).toLowerCase().trim() as WorkflowStatus;
                            const allow = status === "in_review" && orgCanTransition(status, "draft");
                            return allow;
                          })() && (
                          <Button
                            size="sm"
                            onClick={() => handleRowStatusChange(entry.id, "draft")}
                            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-gray-600 hover:!bg-gray-700 active:!bg-gray-800 !text-white !border-gray-600 hover:!border-gray-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
                          >
                            Back to Draft
                          </Button>
                          )}
                        </>
                      )}
                      {(() => {
                        const status = ((entry.status || "") as string).toLowerCase().trim() as WorkflowStatus;
                        const allow = status === "rejected" && orgCanTransition(status, "draft");
                        return allow;
                      })() && (
                        <Button
                          size="sm"
                          onClick={() => handleRowStatusChange(entry.id, "draft")}
                          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-gray-600 hover:!bg-gray-700 active:!bg-gray-800 !text-white !border-gray-600 hover:!border-gray-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
                        >
                          Back to Draft
                        </Button>
                      )}
                      
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
      <StatusTransitionModal
        isOpen={showStatusModal}
        onClose={() => { setShowStatusModal(false); setSelectedToStatus(null); setSelectedEntryId(null); }}
        fromStatus={(((entries.find((e) => e.id === selectedEntryId)?.status || "draft") as string).toLowerCase().trim()) as WorkflowStatus}
        toStatus={(((selectedToStatus || "draft") as string).toLowerCase().trim()) as WorkflowStatus}
        requireComment={(() => {
          const to = (((selectedToStatus || "draft") as string).toLowerCase().trim()) as WorkflowStatus;
          return to === "rejected";
        })()}
        onSubmit={handleSubmitStatus}
      />
      
    </div>
  );
}
