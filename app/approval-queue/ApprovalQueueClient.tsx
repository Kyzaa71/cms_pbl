 "use client";
 
 import { useEffect, useMemo, useState } from "react";
 import { useRouter, useSearchParams } from "next/navigation";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card } from "@/components/ui/card";
 import { Avatar, AvatarFallback } from "@/components/ui/avatar";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Search, Eye, Filter, FileText, Clock, AlertCircle } from "lucide-react";
 import { getInitials } from "@/components/workflow-management/types";
 import { StatusBadge } from "@/components/workflow-management/status-badge";
 import { ApprovalActions } from "@/components/approval-queue/approval-actions";
 import { workflowService } from "@/lib/services/workflow-service";
 import { contentService } from "@/lib/services/content-service";
 import { useContentTypes } from "@/hooks/use-content";
 import { useAuth } from "@/hooks/use-auth";
 import { projectService } from "@/lib/services/project-service";
 import type { ContentEntry, User, WorkflowHistory } from "@/types/backend-models";
 import type { WorkflowStatus } from "@/components/workflow-management/types";
 import type { ContentType } from "@/types/backend-models";
 
 export default function ApprovalQueueClient() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const projectIdParam = searchParams.get("project_id");
   const projectId = projectIdParam ? Number(projectIdParam) : undefined;
   const { data: contentTypes } = useContentTypes(projectId);
   const { user, getCurrentUser } = useAuth();
   const [entries, setEntries] = useState<ContentEntry[]>([]);
   const [approvedEntries, setApprovedEntries] = useState<ContentEntry[]>([]);
   const [publishedEntries, setPublishedEntries] = useState<ContentEntry[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
   const [statusFilter, setStatusFilter] = useState<string>("all");
   const [pendingStats, setPendingStats] = useState<{ total: number; byContentType: { contentType: ContentType; count: number }[] }>({ total: 0, byContentType: [] });
   const [creators, setCreators] = useState<Record<number, User>>({});
   const [actionUsers, setActionUsers] = useState<Record<number, User | null>>({});
   const [publishedTotal, setPublishedTotal] = useState<number>(0);
   const [previewingId, setPreviewingId] = useState<number | null>(null);
   const [projectRoleName, setProjectRoleName] = useState<string>("");
 
   useEffect(() => {
     if (!user) {
       void getCurrentUser();
     }
   }, [user, getCurrentUser]);
 
   useEffect(() => {
     const load = async () => {
       setLoading(true);
       setEntries([]);
       setApprovedEntries([]);
       setPublishedEntries([]);
       if (!contentTypes || contentTypes.length === 0) {
         setLoading(false);
         return;
       }
       const targetStatuses = ["ready_for_approval", "approved", "published"] as const;
       const fetchStatus = async (status: string, ctId: number) => {
         const wf = await workflowService.entriesByStatus(ctId, status, projectId);
         if (wf && wf.length > 0) return wf;
         const { entries: ce } = await contentService.listEntries(ctId, { status, project_id: projectId });
         return ce;
       };
       const pending: ContentEntry[] = [];
       const approved: ContentEntry[] = [];
       const published: ContentEntry[] = [];
       const ctIds = contentTypeFilter !== "all" ? [parseInt(contentTypeFilter)] : (contentTypes || []).map((ct) => ct.id);
       for (const id of ctIds) {
         const [readyItems, approvedItems, publishedItems] = await Promise.all([
           fetchStatus("ready_for_approval", id),
           fetchStatus("approved", id),
           fetchStatus("published", id),
         ]);
         pending.push(...readyItems);
         approved.push(...approvedItems);
         published.push(...publishedItems);
       }
       const allowedCTIds = new Set((contentTypes || []).map((ct) => ct.id));
       const onlyAllowed = (arr: ContentEntry[]) => arr.filter((e) => allowedCTIds.has(e.content_type_id));
       const onlyThisProject = (arr: ContentEntry[]) => projectId ? arr.filter((e) => (e.project_id ?? null) === projectId) : arr;
       setEntries(onlyThisProject(onlyAllowed(pending)));
       setApprovedEntries(onlyThisProject(onlyAllowed(approved)));
       setPublishedEntries(onlyThisProject(onlyAllowed(published)));
 
       const byCT: { contentType: ContentType; count: number }[] = [];
       let total = 0;
       for (const ct of contentTypes) {
         const ready = await workflowService.entriesByStatus(ct.id, "ready_for_approval", projectId);
         const count = ready.length;
         byCT.push({ contentType: ct, count });
         total += count;
       }
       setPendingStats({ total, byContentType: byCT });
 
       setPublishedTotal(onlyThisProject(onlyAllowed(published)).length);
       setLoading(false);
     };
     load();
   }, [contentTypes, contentTypeFilter, statusFilter, projectId]);
 
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
 
   const sourceEntries = statusFilter === "pending" ? entries : statusFilter === "approved" ? approvedEntries : statusFilter === "published" ? publishedEntries : [...entries, ...approvedEntries, ...publishedEntries];
   const filteredEntries = sourceEntries.filter((entry) => {
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
     const matchesContentType = contentTypeFilter === "all" || String(entry.content_type_id) === contentTypeFilter;
     return matchesSearch && matchesContentType;
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
 
   const publishedCount = publishedEntries.length;
 
   const handleView = (entryId: number) => {
     if (projectId) {
       router.push(`/organizational/${projectId}/workspace/workflow/${entryId}?project_id=${projectId}`);
     } else {
       router.push(`/workflow-management/${entryId}`);
     }
   };
 
   const handleApprove = async (entryId: number, comment?: string) => {
     const key = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
     const useChange = key === "projectadmin" || key === "projectowner";
     const updated = useChange
       ? await workflowService.changeStatus(entryId, { status: "approved", comment })
       : await workflowService.approve(entryId, { comment });
     setEntries((prev) => prev.filter((e) => e.id !== updated.id));
     setApprovedEntries((prev) => {
       const exists = prev.some((e) => e.id === updated.id);
       if (exists) return prev.map((e) => (e.id === updated.id ? updated : e));
       return [updated, ...prev];
     });
     alert(`Entry ${entryId} approved${comment ? ` with comment: ${comment}` : ""}`);
   };
 
   const handleReject = async (entryId: number, comment: string) => {
     const status = (() => {
       const e = entries.find((x) => x.id === entryId) || approvedEntries.find((x) => x.id === entryId) || publishedEntries.find((x) => x.id === entryId) || null;
       return ((e?.status || "") as string).toLowerCase().trim();
     })();
     const key = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
     const useChange = status === "ready_for_approval" && (key === "projectadmin" || key === "projectowner");
     const updated = useChange
       ? await workflowService.changeStatus(entryId, { status: "rejected", comment })
       : await workflowService.reject(entryId, { comment });
     if (status === "ready_for_approval") {
       setEntries((prev) => prev.filter((e) => e.id !== updated.id));
     }
     if (status === "approved") {
       setApprovedEntries((prev) => prev.filter((e) => e.id !== updated.id));
     }
     alert(`Entry ${entryId} rejected with reason: ${comment}`);
   };
 
   const handlePublish = async (entryId: number, comment?: string) => {
     const key = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
     const useChange = key === "projectadmin" || key === "projectowner";
     const updated = useChange
       ? await workflowService.changeStatus(entryId, { status: "published", comment })
       : await workflowService.publish(entryId, { comment });
     setApprovedEntries((prev) => prev.filter((e) => e.id !== updated.id));
     setPublishedEntries((prev) => {
       const exists = prev.some((e) => e.id === updated.id);
       if (exists) return prev.map((e) => (e.id === updated.id ? updated : e));
       return [updated, ...prev];
     });
     alert(`Entry ${entryId} published${comment ? ` with comment: ${comment}` : ""}`);
   };
 
   const handleBackToDraft = async (entryId: number) => {
     const updated = await workflowService.changeStatus(entryId, { status: "draft" });
     setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
     alert(`Entry ${entryId} moved back to draft`);
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
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
             Approval Queue
           </h1>
           <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
             Kelola entri dari draft hingga published, dan lakukan approval
           </p>
         </div>
         <Button
           variant="outline"
           onClick={() => {
             if (projectId) {
               router.push(`/organizational/${projectId}/workspace/workflow?project_id=${projectId}`);
             } else {
               router.push("/workflow-management");
             }
           }}
           className="flex items-center gap-2"
         >
           <FileText className="w-4 h-4" />
           View All Workflow
         </Button>
       </div>
 
       {loading ? (
         <div className="flex items-center justify-center h-64">
           <Clock className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" />
         </div>
       ) : (
         <>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm opacity-90">Pending Approvals</p>
                   <p className="text-2xl font-bold mt-1">{pendingStats.total}</p>
                 </div>
                 <Clock className="w-8 h-8 opacity-80" />
               </div>
             </Card>
             <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm opacity-90">Published</p>
                   <p className="text-2xl font-bold mt-1">{publishedTotal}</p>
                 </div>
                 <FileText className="w-8 h-8 opacity-80" />
               </div>
             </Card>
           </div>
           <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
             <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                 <Input
                   placeholder="Search by title..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
                 />
               </div>
               <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
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
               <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                   <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                     <SelectValue placeholder="Status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Approvals</SelectItem>
                     <SelectItem value="pending">Pending</SelectItem>
                     <SelectItem value="approved">Approved</SelectItem>
                     <SelectItem value="published">Published</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
           </Card>
           {filteredEntries.length > 0 ? (
             <div className="overflow-x-auto border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
               <table className="min-w-[800px] w-full border-collapse text-sm">
                 <thead>
                   <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
                     <th className="py-3 px-4 font-medium">Title</th>
                     <th className="py-3 px-4 font-medium">Content Type</th>
                     <th className="py-3 px-4 font-medium">Status</th>
                     <th className="py-3 px-4 font-medium">Creator</th>
                     <th className="py-3 px-4 font-medium">Submitted</th>
                     <th className="py-3 px-4 font-medium">Action By</th>
                     <th className="py-3 px-4 font-medium text-center">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredEntries.map((entry, index) => (
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
                       <td className="py-3 px-4">
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
                           {(entry.status === "ready_for_approval" || entry.status === "approved") && (
                             <ApprovalActions
                               entryId={entry.id}
                               entryTitle={(() => {
                                 const obj = (typeof entry.data === "object" && entry.data) ? (entry.data as Record<string, unknown>) : {};
                                 const cands = ["title", "judul", "name", "meta_title"] as const;
                                 for (const key of cands) {
                                   const v = obj[key];
                                   if (typeof v === "string" && v.trim().length > 0) return v as string;
                                 }
                                 for (const v of Object.values(obj)) { if (typeof v === "string" && v.trim().length > 0) return v; }
                                 return `Entry #${entry.id}`;
                               })()}
                               onApprove={handleApprove}
                               onReject={handleReject}
                               status={entry.status as WorkflowStatus}
                               onPublish={handlePublish}
                               onBackToDraft={handleBackToDraft}
                             />
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <Card className="p-12 text-center bg-[var(--card-bg-inner)] border border-[var(--border)]">
               <AlertCircle className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
               <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                 {statusFilter === "pending" ? "No entries pending approval" : "No published entries"}
               </h3>
               <p className="text-sm text-[var(--muted-foreground)]">
                 All entries have been reviewed or there are no entries ready for approval at this time.
               </p>
             </Card>
           )}
         </>
       )}
     </div>
   );
 }
