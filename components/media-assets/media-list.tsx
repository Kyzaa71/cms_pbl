"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MediaFile, formatFileSize, formatDate, getMediaTypeCategory } from "./types";
import { Eye, Pencil, Trash2, Video, FileText, Image as ImageIcon } from "lucide-react";
import { getBaseUrl } from "@/lib/api-client";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface MediaListProps {
  media: MediaFile[];
  onView?: (media: MediaFile) => void;
  onEdit?: (media: MediaFile) => void;
  onDelete?: (media: MediaFile) => void;
}

export function MediaList({ media, onView, onEdit, onDelete }: MediaListProps) {
  const [previewMap, setPreviewMap] = useState<Record<number, string>>({});
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
    const revoked: string[] = [];
    const load = async () => {
      const next = { ...previewMap };
      const imgTargets = media.filter((m) => getMediaTypeCategory(m.type) === "image" && !(m.id in next));
      imgTargets.forEach((m) => {
        const url = proxiedUrl(m.url);
        if (url) next[m.id] = url;
      });
      const vidTargets = media.filter((m) => getMediaTypeCategory(m.type) === "video" && !(m.id in next));
      vidTargets.forEach((m) => {
        const url = proxiedUrl(m.url);
        if (!url) return;
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
            next[m.id] = dataUrl;
            setPreviewMap({ ...next });
          } catch {}
        });
        video.addEventListener("error", () => {});
      });
      if (imgTargets.length > 0 && vidTargets.length === 0) {
        setPreviewMap(next);
      }
    };
    load();
    return () => { revoked.forEach((u) => URL.revokeObjectURL(u)); };
  }, [media, previewMap, proxiedUrl]);
  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--muted-foreground)]">
        <p className="text-lg font-medium mb-2">No media files found</p>
        <p className="text-sm">Upload files to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
          <tr>
            <th className="py-3 px-4 text-left">Preview</th>
            <th className="py-3 px-4 text-left">File Name</th>
            <th className="py-3 px-4 text-left">Type</th>
            <th className="py-3 px-4 text-left">Size</th>
            <th className="py-3 px-4 text-left">Folder</th>
            <th className="py-3 px-4 text-left">Uploaded By</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {media.map((item, index) => {
            const category = getMediaTypeCategory(item.type);
            return (
              <tr
                key={item.id}
                className={`border-t border-[var(--border)] ${
                  index % 2 === 0
                    ? "bg-[var(--card-bg-inner)]"
                    : "bg-[var(--card-bg)]"
                } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
              >
                {/* Preview */}
                <td className="py-3 px-4">
                  <div className="w-16 h-16 rounded overflow-hidden bg-[var(--card-bg-inner)] flex items-center justify-center">
                    {previewMap[item.id] ? (
                      <img src={previewMap[item.id]} alt={item.alt} className="w-full h-full object-cover" />
                    ) : category === "image" ? (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--card-bg)]">
                        <ImageIcon className="w-8 h-8 text-[var(--muted-foreground)]" />
                      </div>
                    ) : category === "video" ? (
                      <Video className="w-8 h-8 text-[var(--muted-foreground)]" />
                    ) : (
                      <FileText className="w-8 h-8 text-[var(--muted-foreground)]" />
                    )}
                  </div>
                </td>

                {/* File Name */}
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{item.file_name}</p>
                    {item.alt && (
                      <p className="text-xs text-[var(--muted-foreground)]">{item.alt}</p>
                    )}
                  </div>
                </td>

                {/* Type */}
                <td className="py-3 px-4">
                  <Badge
                    className={
                      category === "image"
                        ? "bg-blue-500 text-white"
                        : category === "video"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-500 text-white"
                    }
                  >
                    {category === "image" ? "Image" : category === "video" ? "Video" : "File"}
                  </Badge>
                </td>

                {/* Size */}
                <td className="py-3 px-4 text-[var(--foreground)]">
                  {formatFileSize(item.size)}
                </td>

                {/* Folder */}
                <td className="py-3 px-4 text-[var(--muted-foreground)]">{item.folder}</td>

                {/* Uploaded By */}
                <td className="py-3 px-4">
                  {item.uploader ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(item.uploader.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[var(--foreground)] text-xs">
                        {item.uploader.name.split(" ")[0]}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs">Unknown</span>
                  )}
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-[var(--muted-foreground)]">
                  {formatDate(item.created_at)}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)] transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-yellow-600 hover:text-[color-mix(in srgb, yellow 80%, black)] dark:text-yellow-500 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

