"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { mediaService } from "@/lib/services/media-service";
import { MediaEditForm } from "@/components/media-assets/media-edit-form";
import type { MediaFile, MediaFolder } from "@/types/backend-models";

export default function EditMediaPage() {
  const params = useParams();
  const router = useRouter();
  const mediaId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id)
    : null;
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  useEffect(() => {
    if (!mediaId) return;
    mediaService.getById(mediaId).then(setMedia).catch(() => setMedia(null));
    mediaService.listFolders().then(setFolders).catch(() => setFolders([]));
  }, [mediaId]);

  const handleSave = (data: {
    alt: string;
    caption: string;
    folder: string;
    tags: string[];
  }) => {
    if (!mediaId) return;
    mediaService.update(mediaId, data).then(() => {
      router.push(`/assets/${mediaId}`);
    }).catch((e) => {
      alert(e?.message || "Failed to update media");
    });
  };

  const handleCancel = () => {
    router.push(`/assets/${mediaId}`);
  };

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

