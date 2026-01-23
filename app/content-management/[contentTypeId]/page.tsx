"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  SendToBack,
} from "lucide-react";
import { getStatusBadgeColor, getStatusLabel } from "@/components/content-management/types";
import { useContentType, useEntries, contentActions, useContentTypes } from "@/hooks/use-content";
import { ContentEntry, ContentType, User } from "@/types/backend-models";
import { contentService } from "@/lib/services/content-service";
import { workflowService } from "@/lib/services/workflow-service";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { projectService } from "@/lib/services/project-service";
 

export default function ContentEntriesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { can, user, getCurrentUser } = useAuth();
  
  const rawParam = params.contentTypeId as string;
  const projectIdParam = searchParams.get("project_id");
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  const { data: allCTs } = useContentTypes(projectId);
  const [resolvedId, setResolvedId] = useState<number | null>(null);
  const [projectRoleName, setProjectRoleName] = useState<string>("");

  // Resolve param: accept numeric id or slug
  useEffect(() => {
    if (!rawParam) return;
    const isNumeric = /^\d+$/.test(rawParam);
    if (isNumeric) {
      setResolvedId(parseInt(rawParam, 10));
      return;
    }
    if (allCTs && allCTs.length > 0) {
      const found = allCTs.find((ct) => ct.slug === rawParam);
      setResolvedId(found ? found.id : null);
    }
  }, [rawParam, allCTs]);

  const { data: fetchedCT } = useContentType(resolvedId || 0);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createdByFilter, setCreatedByFilter] = useState<string>("all");
  const [creators, setCreators] = useState<Record<number, User>>({});
  const entriesParams = useMemo(() => {
    return {
      page,
      limit: 10,
      status: statusFilter !== "all" ? statusFilter : undefined,
      project_id: projectId,
    } as { page?: number; limit?: number; status?: string; project_id?: number };
  }, [page, statusFilter, projectId]);
  const { data: entries, meta, error: entriesError, refetch } = useEntries(resolvedId || 0, entriesParams);

  useEffect(() => {
    if (fetchedCT) setContentType(fetchedCT);
  }, [fetchedCT]);
  useEffect(() => {
    const fillCreators = async () => {
      const targets = entries.filter((e) => !e.creator?.id);
      if (targets.length === 0) return;
      const results = await Promise.allSettled<ContentEntry>(targets.map((e) => contentService.getEntry(e.id)));
      const next: Record<number, User> = { ...creators };
      results.forEach((res) => {
        if (res.status === "fulfilled") {
          const creator = res.value.creator as User | undefined;
          const cid = creator?.id;
          if (typeof cid === "number") next[cid] = creator as User;
        }
      });
      setCreators(next);
    };
    fillCreators();
  }, [entries]);
  // Removed auto refresh to avoid spamming /auth/refresh and hitting rate limit
  

  // Fetch current user's project role (if in project context)
  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!projectId || !user?.id) {
        setProjectRoleName("");
        return;
      }
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
    const matchesStatus = statusFilter === "all" || entry.status === (statusFilter as unknown as string);
    const createdById = typeof entry.created_by === "number" ? String(entry.created_by) : "";
    const matchesCreator = createdByFilter === "all" || createdById === createdByFilter || (entry.creator?.id && String(entry.creator.id) === createdByFilter);
    return matchesSearch && matchesStatus && matchesCreator;
  });

  // Stats
  const stats = {
    total: entries.length,
    draft: entries.filter((e) => e.status === "draft").length,
    inReview: entries.filter((e) => e.status === "in_review").length,
    readyForApproval: entries.filter((e) => e.status === "ready_for_approval").length,
    approved: entries.filter((e) => e.status === "approved").length,
    published: entries.filter((e) => e.status === "published").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  // Handlers
  const handleView = (entryId: number) => {
    if (!resolvedId) return;
    if (projectId) {
      router.push(`/organizational/${projectId}/workspace/entries/${resolvedId}/entries/${entryId}?project_id=${projectId}`);
    } else {
      router.push(`/content-management/${resolvedId}/entries/${entryId}`);
    }
  };

  const handleEdit = (entryId: number) => {
    if (!resolvedId) return;
    if (projectId) {
      router.push(`/organizational/${projectId}/workspace/entries/${resolvedId}/entries/${entryId}?project_id=${projectId}&mode=edit`);
    } else {
      router.push(`/content-management/${resolvedId}/entries/${entryId}?mode=edit`);
    }
  };

  const handleDelete = async (entry: ContentEntry) => {
    if (!(can("ContentEntry", "delete") || (!!projectId && canProjectDelete))) { alert("no permission"); return; }
    if (entry.status === "published") {
      alert("Cannot delete published entries. Please unpublish first.");
      return;
    }

    if (confirm(`Are you sure you want to delete this entry?`)) {
      await contentActions.deleteEntry(entry.id);
      refetch();
    }
  };

  // Permission: allow create if global can() OR user has sufficient project role
  const canProjectCreate = useMemo(() => {
    const rn = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
    return rn === "projectadmin" || rn === "projecteditor" || rn === "projectcontentwriter";
  }, [projectRoleName]);
  const canCreate = can("ContentEntry", "create") || (!!projectId && canProjectCreate);
  const canProjectUpdate = useMemo(() => {
    const rn = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
    return rn === "projectadmin" || rn === "projecteditor" || rn === "projectcontentwriter";
  }, [projectRoleName]);
  const canProjectDelete = useMemo(() => {
    const rn = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
    return rn === "projectadmin";
  }, [projectRoleName]);

  // Quick workflow actions
  const handleStatusChange = async (entry: ContentEntry, to: "in_review" | "ready_for_approval" | "approved" | "published" | "rejected" | "draft") => {
    let updated: ContentEntry | null = null;
    if (to === "in_review") {
      updated = await workflowService.requestReview(entry.id, {});
    } else if (to === "ready_for_approval") {
      updated = await workflowService.changeStatus(entry.id, { status: "ready_for_approval" });
    } else if (to === "approved") {
      updated = await workflowService.approve(entry.id, {});
  } else if (to === "published") {
    updated = await workflowService.publish(entry.id, {});
  } else if (to === "rejected") {
    const reason = prompt("Reason to reject?") || "";
    const roleNameRaw = (user?.role?.name || "").toLowerCase().trim();
    const roleName = roleNameRaw || "viewer";
    const from = (entry.status || "draft").toLowerCase().trim();
    if (roleName === "editor" && from === "in_review") {
      updated = await workflowService.changeStatus(entry.id, { status: "rejected", comment: reason || "Rejected" });
    } else {
      updated = await workflowService.reject(entry.id, { comment: reason || "Rejected" });
    }
  } else if (to === "draft") {
    updated = await workflowService.changeStatus(entry.id, { status: "draft" });
  }
    if (updated) {
      // refresh list
      await refetch();
    }
  };

  if (resolvedId === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-management">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Loading content type...</p>
          <Link href="/content-management">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/content-management">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              {contentType.name} Entries
            </h1>
              <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
                Manage all entries for {contentType.name} content type. Edit content here, use{" "}
                <Link href="/workflow-management" className="text-[var(--primary)] hover:underline">
                  Workflow Management
                </Link>{" "}
                to change status.
              </p>
          </div>
        </div>
        {canCreate && (
          <Link
            href={
              projectId
                ? `/organizational/${projectId}/workspace/entries/${resolvedId}/create`
                : `/content-management/${resolvedId}/create`
            }
          >
            <Button
              onClick={(e) => {
                // Optional: prevent default if you want to rely solely on router.push or vice versa.
                // But keeping it consistent with original behavior (Link + Button onClick).
                e.preventDefault(); 
                if (projectId) {
                  router.push(`/organizational/${projectId}/workspace/entries/${resolvedId}/create`);
                } else {
                  router.push(`/content-management/${resolvedId}/create`);
                }
              }}
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Entry
            </Button>
          </Link>
        )}
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
              placeholder="Search entries..."
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

          {/* Creator Filter */}
          <Select value={createdByFilter} onValueChange={setCreatedByFilter}>
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Created By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Creators</SelectItem>
              {(() => {
                const map = new Map<number, { id: number; name: string }>();
                for (const e of entries as ContentEntry[]) {
                  const u = e.creator ?? (typeof e.created_by === "number" ? creators[e.created_by] : undefined);
                  const name = u?.name || "Unknown";
                  const email = u?.email || "";
                  const display = email ? `${name} - ${email}` : name;
                  const uid = u?.id ?? (typeof e.created_by === "number" ? e.created_by : undefined);
                  if (typeof uid === "number" && !map.has(uid)) {
                    map.set(uid, { id: uid, name: display });
                  }
                }
                return Array.from(map.values()).map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ));
              })()}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Error States */}
      {entriesError && (
        <Card className="p-3 border border-[var(--danger)] bg-[color-mix(in srgb, var(--danger) 10%, var(--card-bg))] text-[var(--foreground)]">
          <div className="text-sm">Tidak dapat memuat entries untuk content type ini. Pastikan Anda sudah login dan memiliki akses.</div>
        </Card>
      )}

      {/* Entries Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Created By</th>
              <th className="py-3 px-4 font-semibold">Updated</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--card-bg-inner)]">
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  Tidak ada data entries untuk content type ini. Gunakan tombol &quot;Create Entry&quot; di atas untuk membuat entri pertama.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, index) => {
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
                return (
                  <tr
                    key={entry.id}
                    className={`border-t border-[var(--border)] ${
                      index % 2 === 0
                        ? "bg-[var(--card-bg-inner)]"
                        : "bg-[var(--card-bg)]"
                    } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
                  >
                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--foreground)] max-w-md truncate">
                        {title}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusBadgeColor(entry.status)} border-none`}>
                        {getStatusLabel(entry.status)}
                      </Badge>
                    </td>

                    {/* Created By */}
                    <td className="py-3 px-4">
                      {(() => {
                        const cid = typeof entry.created_by === "string" ? parseInt(entry.created_by, 10) : entry.created_by;
                        const u = entry.creator ?? (typeof cid === "number" ? creators[cid] : undefined);
                        const name = u?.name || "Unknown";
                        const email = u?.email || "";
                        const display = email ? `${name} - ${email}` : name;
                        return (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={u?.profile || ""} alt={name} />
                              <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)] text-xs">
                                {typeof name === "string" ? name.slice(0, 2).toUpperCase() : ""}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-[var(--foreground)]">{display}</span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {new Date(entry.updated_at || Date.now()).toLocaleDateString()}
            </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(entry.id)}
                          className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(can("ContentEntry", "update") || (!!projectId && canProjectUpdate)) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(entry.id)}
                            className="text-yellow-600 hover:text-[color-mix(in srgb, yellow 80%, black)] dark:text-yellow-500"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {(can("ContentEntry", "delete") || (!!projectId && canProjectDelete)) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entry)}
                            className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Workflow actions removed from Content Management */}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-[var(--muted-foreground)]">
          Page {meta.page || page} of {meta.total_pages || 1}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={(meta.page || page) <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
          <Button variant="outline" disabled={(meta.page || page) >= (meta.total_pages || 1)} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
