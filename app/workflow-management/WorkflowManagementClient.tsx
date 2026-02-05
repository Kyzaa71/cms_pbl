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
 
 export default function WorkflowManagementClient() {
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
         setEntries((prev) => prev.map((e) => (e.id === selectedEntryId ? updated! : e)));
       }
     } catch {}
     setShowStatusModal(false);
     setSelectedToStatus(null);
     setSelectedEntryId(null);
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
             Workflow Management
           </h1>
           <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
             Manage content statuses and transitions across projects
           </p>
         </div>
       </div>
 
       <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
             <Input
               placeholder="Search entries..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
             />
           </div>
           <div className="flex items-center gap-2">
             <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All</SelectItem>
                 <SelectItem value="draft">Draft</SelectItem>
                 <SelectItem value="in_review">In Review</SelectItem>
                 <SelectItem value="ready_for_approval">Ready for Approval</SelectItem>
                 <SelectItem value="approved">Approved</SelectItem>
                 <SelectItem value="published">Published</SelectItem>
                 <SelectItem value="rejected">Rejected</SelectItem>
               </SelectContent>
             </Select>
             <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
               <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                 <SelectValue placeholder="Content Type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Types</SelectItem>
                 {(contentTypes || []).map((ct) => (
                   <SelectItem key={ct.id} value={String(ct.id)}>{ct.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
       </Card>
 
       <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
         <table className="w-full border-collapse text-sm">
           <thead>
             <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
               <th className="py-3 px-4 font-medium">Title</th>
               <th className="py-3 px-4 font-medium">Type</th>
               <th className="py-3 px-4 font-medium">Status</th>
               <th className="py-3 px-4 font-medium">Actions</th>
             </tr>
           </thead>
           <tbody>
             {filteredEntries.length > 0 ? (
               filteredEntries.map((entry) => {
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
                   <tr key={entry.id} className="border-t border-[var(--border)]">
                     <td className="py-3 px-4">
                       <Link href={`/content-relations/${entry.id}`} className="text-[var(--foreground)] hover:underline">
                         {title}
                       </Link>
                     </td>
                     <td className="py-3 px-4 text-[var(--muted-foreground)]">
                       {(contentTypes || []).find((ct) => ct.id === entry.content_type_id)?.name || `Type #${entry.content_type_id}`}
                     </td>
                     <td className="py-3 px-4">
                       <StatusBadge status={entry.status as any} />
                     </td>
                     <td className="py-3 px-4">
                       <div className="flex items-center gap-2">
                         {getAvailableTransitions(entry.status as WorkflowStatus).map((to) => (
                           <Button key={to} variant="outline" size="sm" onClick={() => handleRowStatusChange(entry.id, to)}>
                             {to}
                           </Button>
                         ))}
                       </div>
                     </td>
                   </tr>
                 );
               })
             ) : (
               <tr>
                 <td className="py-6 px-4 text-center text-[var(--muted-foreground)]" colSpan={4}>
                   No entries found.
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
 
       <StatusTransitionModal
         isOpen={showStatusModal}
         onClose={() => { setShowStatusModal(false); setSelectedToStatus(null); setSelectedEntryId(null); }}
         onSubmit={handleSubmitStatus}
         toStatus={selectedToStatus}
       />
     </div>
   );
 }
