"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MediaUploadForm } from "@/components/media-assets/media-upload-form";
import type { MediaFolder } from "@/types/backend-models";
import { mediaService } from "@/lib/services/media-service";
import { useAuth } from "@/hooks/use-auth";
import { projectService } from "@/lib/services/project-service";

interface UploadFile {
  file: File;
  preview?: string;
  error?: string;
}

export default function OrgUploadMediaPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const projectId = useMemo(() => Number(idParam), [idParam]);
  const { can, user, getCurrentUser } = useAuth();
  const roleName = (user?.role?.name || "").toLowerCase();
  const [projectRoleName, setProjectRoleName] = useState<string>("");
  useEffect(() => {
    let active = true;
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
  }, [projectId, user?.id]);
  const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const canUpload =
    can("Media", "create") ||
    roleName === "projectadmin" ||
    ["projectadmin", "projecteditor", "projectcontentwriter"].includes(projectRoleKey);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  useEffect(() => {
    mediaService.listFolders(projectId).then(setFolders).catch(() => setFolders([]));
    (async () => { try { await getCurrentUser(); } catch {} })();
  }, [projectId, getCurrentUser]);

  const handleUpload = (
    files: UploadFile[],
    metadata: { folder?: string; alt?: string; caption?: string; tags?: string[] }
  ) => {
    const f = files[0]?.file;
    if (!f) return;
    mediaService.upload(f, { ...metadata, project_id: projectId }).then(() => {
      router.push(`/organizational/${projectId}/workspace/media`);
    }).catch((e) => {
      alert(e?.message || "Failed to upload file");
    });
  };

  const handleCancel = () => {
    router.push(`/organizational/${projectId}/workspace/media`);
  };

  if (!canUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => handleCancel()} className="hover:bg-[var(--card-bg)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">No Permission</h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">You do not have permission to upload media.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="hover:bg-[var(--card-bg)]">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">Upload Media</h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">Upload a single file with metadata</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <MediaUploadForm folders={folders} onUpload={handleUpload} onCancel={handleCancel} mode="single" />
      </div>
    </div>
  );
}
