 "use client";
 
 import { useState, useEffect } from "react";
 import { useRouter, useSearchParams } from "next/navigation";
 import Link from "next/link";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card } from "@/components/ui/card";
 import { Switch } from "@/components/ui/switch";
 import { ArrowLeft, X } from "lucide-react";
 import { contentActions } from "@/hooks/use-content";
 import type { ContentType } from "@/types/backend-models";
 import { useAuth } from "@/hooks/use-auth";
 import { projectService } from "@/lib/services/project-service";
 
 function formatSlug(name: string) {
   return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
 }
 
 export default function CreateContentTypeClient() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const projectIdParam = searchParams.get("project_id");
   const projectId = projectIdParam ? Number(projectIdParam) : undefined;
   const { user, getCurrentUser } = useAuth();
   const [projectRoleName, setProjectRoleName] = useState<string>("");
   const [name, setName] = useState("");
   const [slug, setSlug] = useState("");
   const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
   const [enableSeo, setEnableSeo] = useState(false);
 
   useEffect(() => {
     let active = true;
     (async () => { try { await getCurrentUser(); } catch {} })();
     const fetchRole = async () => {
       if (!projectId || !user?.id) { if (active) setProjectRoleName(""); return; }
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
   }, [projectId, user?.id, getCurrentUser]);
   const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
   const canCreate = !projectId || ["projectadmin","projecteditor","projectcontentwriter"].includes(projectRoleKey);
 
   const handleNameChange = (value: string) => {
     setName(value);
     if (autoGenerateSlug) {
       setSlug(formatSlug(value));
     }
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!name.trim() || !slug.trim()) {
       alert("Name and slug are required");
       return;
     }
     if (!canCreate) {
       alert("No permission");
       return;
     }
     try {
       const created: ContentType = await contentActions.createContentType({ name, slug, project_id: projectId });
       try {
         await contentActions.updateContentType(created.id, { name, slug, enable_seo: enableSeo });
       } catch {}
       if (projectId) {
         router.push(`/organizational/${projectId}/workspace/content-builder?project_id=${projectId}`);
       } else {
         router.push(`/content-builder/${created.id}`);
       }
     } catch (err: unknown) {
       const msg = err instanceof Error ? err.message : "";
       alert(msg || "Failed to create content type");
     }
   };
 
   return (
     <div className="max-w-2xl mx-auto">
       <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
         <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <Link href={projectId ? `/organizational/${projectId}/workspace/content-builder?project_id=${projectId}` : "/content-builder"}>
               <Button variant="ghost" size="sm" className="p-2">
                 <ArrowLeft className="w-4 h-4" />
               </Button>
             </Link>
             <div>
               <h2 className="text-xl font-semibold text-[var(--foreground)]">
                 Create Content Type
               </h2>
               <p className="text-sm text-[var(--muted-foreground)]">
                 Step 1: Define name and slug
               </p>
             </div>
           </div>
           <Link href={projectId ? `/organizational/${projectId}/workspace/content-builder?project_id=${projectId}` : "/content-builder"}>
             <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
               <X className="w-5 h-5 text-[var(--muted-foreground)]" />
             </button>
           </Link>
         </div>
 
         {!canCreate && (
           <div className="text-[var(--danger)] text-sm mb-4">
             No Permission: Anda tidak memiliki izin untuk membuat content type pada proyek ini.
           </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
             </label>
             <Input
               type="text"
               value={name}
               onChange={(e) => handleNameChange(e.target.value)}
               className="border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
               required
             />
           </div>
 
           <div>
             <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
               API Slug *
             </label>
             <div className="flex items-center gap-2 mb-2">
               <Input
                 type="text"
                 value={slug}
                 onChange={(e) => {
                   setSlug(e.target.value);
                   setAutoGenerateSlug(false);
                 }}
                 className="border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
                 required
               />
               <Switch
                 checked={autoGenerateSlug}
                 onCheckedChange={setAutoGenerateSlug}
               />
               <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">Auto</span>
             </div>
             <p className="text-xs text-[var(--muted-foreground)]">
               Slug digunakan pada API. Harus unik dan huruf kecil.
             </p>
           </div>
 
           <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-md">
             <div>
               <p className="font-medium text-sm text-[var(--foreground)]">
                 Enable SEO Fields
               </p>
               <p className="text-xs text-[var(--muted-foreground)]">
                 Izinkan entri memiliki metadata SEO (meta title, description, dll.)
               </p>
             </div>
             <Switch checked={enableSeo} onCheckedChange={setEnableSeo} />
           </div>
 
           <div className="flex gap-3 pt-4">
             <Link href={projectId ? `/organizational/${projectId}/workspace/content-builder?project_id=${projectId}` : "/content-builder"} className="flex-1">
               <Button 
                 type="button" 
                 variant="outline" 
                 className="w-full !font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
               >
                 Cancel
               </Button>
             </Link>
             <Button
               type="submit"
               className="flex-1 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
             >
               Create Type
             </Button>
           </div>
         </form>
       </Card>
     </div>
   );
 }
