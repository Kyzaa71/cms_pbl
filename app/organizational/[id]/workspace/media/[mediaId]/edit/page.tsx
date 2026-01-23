"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { mediaService } from "@/lib/services/media-service";
import { MediaEditForm } from "@/components/media-assets/media-edit-form";
import type { MediaFile, MediaFolder } from "@/types/backend-models";
import { useAuth } from "@/hooks/use-auth";
import { projectService } from "@/lib/services/project-service";

export default function OrgEditMediaPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const projectId = useMemo(() => Number(idParam), [idParam]);
  const mediaId = params?.mediaId
    ? parseInt(Array.isArray(params.mediaId) ? params.mediaId[0] : (params.mediaId as string))
    : null;

  const { user, getCurrentUser } = useAuth();
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
    (async () => { try { await getCurrentUser(); } catch {} })();
    fetchRole();
    return () => { active = false; };
  }, [projectId, user?.id, getCurrentUser]);
  const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const canEdit = ["projectadmin", "projecteditor"].includes(projectRoleKey);

  const [media, setMedia] = useState<MediaFile | null>(null);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  useEffect(() => {
    if (!mediaId) return;
    mediaService.getById(mediaId).then(setMedia).catch(() => setMedia(null));
    mediaService.listFolders(projectId).then(setFolders).catch(() => setFolders([]));
  }, [mediaId, projectId]);

  const handleSave = (data: {
    alt: string;
    caption: string;
    folder: string;
    tags: string[];
  }) => {
    if (!mediaId) return;
    if (!canEdit) {
      alert("You do not have permission to edit media in this project");
      return;
    }
    mediaService.update(mediaId, data, projectId).then(() => {
      router.push(`/organizational/${projectId}/workspace/media`);
    }).catch((e) => {
      alert(e?.message || "Failed to update media");
    });
  };

  const handleCancel = () => {
    router.push(`/organizational/${projectId}/workspace/media`);
  };

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} className="hover:bg-[var(--card-bg)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">No Permission</h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              You do not have permission to edit media in this project.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        Media not found
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
            Edit Media
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Update metadata for: {media.file_name}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-2xl">
        <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          {media && (
            <MediaEditForm
              media={media}
              folders={folders}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
