"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function UploadMediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || "single") as "single" | "bulk";
  const projectIdParam = useMemo(() => {
    const v = Number(searchParams.get("project_id") || 0);
    return Number.isFinite(v) && v > 0 ? v : undefined;
  }, [searchParams]);
  const { can, user, getCurrentUser } = useAuth();
  const roleName = (user?.role?.name || "").toLowerCase();
  const [projectRoleName, setProjectRoleName] = useState<string>("");
  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!projectIdParam || !user?.id) { if (active) setProjectRoleName(""); return; }
      try {
        const members = await projectService.getProjectMembers(projectIdParam);
        const me = members.find((m) => m.user_id === user.id);
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    fetchRole();
    return () => { active = false; };
  }, [projectIdParam, user?.id]);
  const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const canUpload =
    can("Media", "create") ||
    roleName === "projectadmin" ||
    ["projectadmin", "projecteditor", "projectcontentwriter"].includes(projectRoleKey);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  useEffect(() => {
    mediaService.listFolders(projectIdParam).then(setFolders).catch(() => setFolders([]));
    (async () => { try { await getCurrentUser(); } catch {} })();
  }, [projectIdParam, getCurrentUser]);

  const handleUpload = (
    files: UploadFile[],
    metadata: {
      folder?: string;
      alt?: string;
      caption?: string;
      tags?: string[];
    }
  ) => {
    if (mode === "single") {
      const f = files[0]?.file;
      if (!f) return;
      mediaService.upload(f, { ...metadata, project_id: projectIdParam }).then(() => {
        if (projectIdParam) router.push(`/organizational/${projectIdParam}/workspace/media`);
        else router.push("/assets");
      }).catch((e) => {
        alert(e?.message || "Failed to upload file");
      });
    } else {
      const fs = files.map((x) => x.file);
      mediaService.bulkUpload(fs, metadata.folder, projectIdParam).then(() => {
        if (projectIdParam) router.push(`/organizational/${projectIdParam}/workspace/media`);
        else router.push("/assets");
      }).catch((e) => {
        alert(e?.message || "Failed to upload files");
      });
    }
  };

  const handleCancel = () => {
    if (projectIdParam) router.push(`/organizational/${projectIdParam}/workspace/media`);
    else router.push("/assets");
  };

  if (!canUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCancel()}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              No Permission
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              You do not have permission to upload media.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="hover:bg-[var(--card-bg)]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Upload Media
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            {mode === "single"
              ? "Upload a single file with metadata"
              : "Upload multiple files at once"}
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="max-w-3xl">
        <MediaUploadForm
          folders={folders}
          onUpload={handleUpload}
          onCancel={handleCancel}
          mode={mode}
        />
      </div>
    </div>
  );
}
