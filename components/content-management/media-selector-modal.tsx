"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Check } from "lucide-react";
import { MediaGrid } from "@/components/media-assets/media-grid";
import { MediaFilters } from "@/components/media-assets/media-filters";
import { filterMediaByType, searchMedia, filterMediaByFolder } from "@/components/media-assets/types";
import type { MediaFile, MediaFolder } from "@/types/backend-models";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { mediaService } from "@/lib/services/media-service";

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaFile) => void;
  currentMediaId?: number;
  allowedTypes?: string[]; // e.g., ["image/*"] to only allow images
}

export function MediaSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentMediaId,
  allowedTypes,
}: MediaSelectorModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const projectIdFromQuery = (() => {
    const raw = searchParams.get("project_id");
    const v = raw ? Number(raw) : NaN;
    return Number.isFinite(v) && v > 0 ? v : undefined;
  })();
  const projectIdFromPath = (() => {
    const m = pathname.match(/\/organizational\/(\d+)\/workspace/i);
    if (m && m[1]) {
      const v = Number(m[1]);
      return Number.isFinite(v) && v > 0 ? v : undefined;
    }
    return undefined;
  })();
  const projectId = projectIdFromQuery ?? projectIdFromPath;
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [selectedMediaId, setSelectedMediaId] = useState<number | undefined>(currentMediaId);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      mediaService.list({ page: 1, limit: 200, project_id: projectId }),
      mediaService.listFolders(projectId),
    ])
      .then(([list, f]) => {
        setMedia(list.media);
        setFolders(f);
      })
      .finally(() => setLoading(false));
  }, [isOpen, projectId]);

  let filteredMedia = media;
  filteredMedia = filterMediaByType(filteredMedia, typeFilter);
  filteredMedia = folderFilter !== "all" ? filterMediaByFolder(filteredMedia, folderFilter) : filteredMedia;
  filteredMedia = searchMedia(filteredMedia, searchQuery);

  // Apply type restrictions if specified
  if (allowedTypes && allowedTypes.length > 0) {
    filteredMedia = filteredMedia.filter((media) => {
      return allowedTypes.some((allowedType) => {
        if (allowedType.endsWith("/*")) {
          const prefix = allowedType.split("/")[0];
          return media.type.startsWith(prefix + "/");
        }
        return media.type === allowedType;
      });
    });
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedMediaId(currentMediaId);
    }
  }, [isOpen, currentMediaId]);

  const handleSelectMedia = (media: MediaFile, selected: boolean) => {
    if (selected) {
      setSelectedMediaId(media.id);
    } else {
      setSelectedMediaId(undefined);
    }
  };

  const handleConfirm = () => {
    if (selectedMediaId) {
      const selected = media.find((m) => m.id === selectedMediaId);
      if (selected) {
        onSelect(selected);
        onClose();
      }
    }
  };

  const handleUploadNew = () => {
    onClose();
    if (projectId) {
      router.push(`/organizational/${projectId}/workspace/media/upload`);
    } else {
      router.push("/assets/upload");
    }
  };

  if (!isOpen) return null;

  const selectedMedia = selectedMediaId ? media.find((m) => m.id === selectedMediaId) : undefined;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-[var(--card-bg)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Select Media</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Choose an existing media file or upload a new one
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleUploadNew}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload New
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-[var(--hover)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[var(--border)]">
          <MediaFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            folderFilter={folderFilter}
            onFolderFilterChange={setFolderFilter}
            folders={folders}
          />
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted-foreground)]">
              <p className="text-lg font-medium mb-2">No media files found</p>
              <p className="text-sm mb-4">Try adjusting your filters or upload a new file</p>
              <Button variant="outline" onClick={handleUploadNew}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </div>
          ) : (
            <MediaGrid
              media={filteredMedia}
              onSelect={handleSelectMedia}
              selectedIds={selectedMediaId ? [selectedMediaId] : []}
            />
          )}
        </div>

        {/* Footer with selected media preview and actions */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--card-bg-inner)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedMedia ? (
                <>
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] flex-shrink-0">
                    {selectedMedia.type.startsWith("image/") ? (
                      <img
                        src={selectedMedia.url}
                        alt={selectedMedia.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-[var(--muted-foreground)]">File</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {selectedMedia.file_name}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {selectedMedia.type}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No media selected. Click on a media file to select it.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedMedia}
                className="!bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" />
                Select Media
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

