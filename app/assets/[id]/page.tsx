"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MediaDetailView } from "@/components/media-assets/media-detail-view";
import { mediaService } from "@/lib/services/media-service";
import type { MediaFile } from "@/types/backend-models";

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mediaId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id)
    : null;
  const [media, setMedia] = useState<MediaFile | null>(null);
  useEffect(() => {
    if (!mediaId) return;
    mediaService.getById(mediaId).then(setMedia).catch(() => setMedia(null));
  }, [mediaId]);

  const handleEdit = (media: MediaFile) => {
    router.push(`/assets/${media.id}/edit`);
  };

  const handleDelete = (media: MediaFile) => {
    if (confirm(`Are you sure you want to delete "${media.file_name}"?`)) {
      mediaService.remove(media.id).then(() => {
        router.push("/assets");
      }).catch((e) => {
        alert(e?.message || "Failed to delete media");
      });
    }
  };

  return <MediaDetailView media={media} onEdit={handleEdit} onDelete={handleDelete} />;
}

