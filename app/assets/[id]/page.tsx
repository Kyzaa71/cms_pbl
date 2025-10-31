"use client";

import { useParams, useRouter } from "next/navigation";
import { getMediaById } from "@/components/media-assets/types";
import { MediaDetailView } from "@/components/media-assets/media-detail-view";

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mediaId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id)
    : null;

  const media = mediaId ? getMediaById(mediaId) : null;

  const handleEdit = (media: any) => {
    router.push(`/assets/${media.id}/edit`);
  };

  const handleDelete = (media: any) => {
    if (confirm(`Are you sure you want to delete "${media.file_name}"?`)) {
      console.log("Delete media:", media.id);
      // In real app, this would call API: DELETE /media/:id
      router.push("/assets");
    }
  };

  return <MediaDetailView media={media} onEdit={handleEdit} onDelete={handleDelete} />;
}

