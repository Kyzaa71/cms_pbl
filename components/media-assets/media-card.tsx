"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaFile, formatFileSize, getMediaTypeCategory } from "./types";
import { Eye, Pencil, Trash2, Image as ImageIcon, Video, FileText } from "lucide-react";
import { getBaseUrl } from "@/lib/api-client";

interface MediaCardProps {
  media: MediaFile;
  onView?: (media: MediaFile) => void;
  onEdit?: (media: MediaFile) => void;
  onDelete?: (media: MediaFile) => void;
  onSelect?: (media: MediaFile, selected: boolean) => void;
  selected?: boolean;
}

export function MediaCard({
  media,
  onView,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const category = getMediaTypeCategory(media.type);
  const isImage = category === "image";
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const BASE_URL = getBaseUrl();

  const normalizeUrl = (url?: string): string | null => {
    if (!url) return null;
    const cleaned = url.trim().replace(/[\\]+/g, "/");
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return `${BASE_URL}${cleaned}`;
    return `${BASE_URL}/${cleaned}`;
  };

  const proxiedUrl = (url?: string): string | null => {
    const u = normalizeUrl(url);
    return u ? `/api/media-proxy?url=${encodeURIComponent(u)}` : null;
  };

  useEffect(() => {
    const revoked: string | null = null;
    const url = proxiedUrl(media.url);
    if (isImage) {
      setPreviewSrc(url);
      return () => { if (revoked) URL.revokeObjectURL(revoked); };
    }
    if (category === "video" && url) {
      const video = document.createElement("video");
      video.src = url;
      video.preload = "metadata";
      video.muted = true;
      video.addEventListener("loadeddata", () => {
        try {
          const canvas = document.createElement("canvas");
          const w = Math.max(1, video.videoWidth);
          const h = Math.max(1, video.videoHeight);
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(video, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setPreviewSrc(dataUrl);
        } catch {}
      });
      video.addEventListener("error", () => {
        setPreviewSrc(null);
      });
    } else {
      setPreviewSrc(null);
    }
    return () => { if (revoked) URL.revokeObjectURL(revoked); };
  }, [media, isImage, category]);

  return (
    <Card
      className={`relative overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] cursor-pointer transition-all duration-200 ${
        selected ? "ring-2 ring-[var(--primary)]" : ""
      } ${isHovered ? "shadow-lg scale-105" : "shadow-sm"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(media)}
    >
      {/* Thumbnail/Preview */}
      <div className="relative aspect-video bg-[var(--card-bg-inner)] overflow-hidden">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={media.alt}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : isImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-inner)]">
            <ImageIcon className="w-16 h-16 text-[var(--muted-foreground)]" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-inner)]">
            {category === "video" ? (
              <Video className="w-16 h-16 text-[var(--muted-foreground)]" />
            ) : category === "document" ? (
              <FileText className="w-16 h-16 text-[var(--muted-foreground)]" />
            ) : (
              <ImageIcon className="w-16 h-16 text-[var(--muted-foreground)]" />
            )}
          </div>
        )}

        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(media);
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4 text-[var(--foreground)]" />
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(media);
                }}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4 text-[var(--foreground)]" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(media);
                }}
                className="p-2 bg-red-500/90 rounded-full hover:bg-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        )}

        {/* Selection indicator */}
        {onSelect && (
          <div
            className="absolute top-2 left-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(media, !selected);
            }}
          >
            <div
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                selected
                  ? "bg-[var(--primary)] border-[var(--primary)]"
                  : "bg-white/80 border-white/80 hover:bg-white"
              }`}
            >
              {selected && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <Badge
            className={`text-xs ${
              category === "image"
                ? "bg-blue-500 text-white"
                : category === "video"
                ? "bg-purple-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {category === "image" ? "Image" : category === "video" ? "Video" : "File"}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-[var(--foreground)] truncate" title={media.file_name}>
          {media.file_name}
        </p>
        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <span>{formatFileSize(media.size)}</span>
          {media.width && media.height && (
            <span>
              {media.width} × {media.height}
            </span>
          )}
        </div>
        {media.folder && (
          <p className="text-xs text-[var(--muted-foreground)] truncate" title={media.folder}>
            📁 {media.folder}
          </p>
        )}
      </div>
    </Card>
  );
}

