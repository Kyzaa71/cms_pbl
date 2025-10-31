"use client";

import { MediaFile } from "./types";
import { MediaCard } from "./media-card";

interface MediaGridProps {
  media: MediaFile[];
  onView?: (media: MediaFile) => void;
  onEdit?: (media: MediaFile) => void;
  onDelete?: (media: MediaFile) => void;
  onSelect?: (media: MediaFile, selected: boolean) => void;
  selectedIds?: number[];
}

export function MediaGrid({
  media,
  onView,
  onEdit,
  onDelete,
  onSelect,
  selectedIds = [],
}: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--muted-foreground)]">
        <p className="text-lg font-medium mb-2">No media files found</p>
        <p className="text-sm">Upload files to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
          selected={selectedIds.includes(item.id)}
        />
      ))}
    </div>
  );
}

