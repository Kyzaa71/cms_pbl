"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MediaFile,
  formatFileSize,
  formatDateTime,
  getMediaTypeCategory,
} from "./types";
import  {
  ArrowLeft,
  Pencil,
  Trash2,
  Download,
  Copy,
  Image as ImageIcon,
  Video,
  FileText,
  Calendar,
  User,
  Folder,
  Tag,
} from "lucide-react";
import { getBaseUrl } from "@/lib/api-client";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface MediaDetailViewProps {
  media: MediaFile | null;
  onEdit?: (media: MediaFile) => void;
  onDelete?: (media: MediaFile) => void;
}

export function MediaDetailView({ media, onEdit, onDelete }: MediaDetailViewProps) {
  const router = useRouter();
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
    let revoked: string | null = null;
    async function loadPreview() {
      try {
        const isImg = !!(media && getMediaTypeCategory(media.type) === "image");
        const resourceUrl = normalizeUrl(media?.url || undefined);
        if (!media || !isImg || !resourceUrl) {
          setPreviewSrc(null);
          return;
        }
        const token = (await import("@/lib/api-client")).api.getToken() ?? "";
        const res = await fetch(resourceUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setPreviewSrc(null);
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        revoked = url;
        setPreviewSrc(url);
      } catch {
        setPreviewSrc(null);
      }
    }
    loadPreview();
    return () => { if (revoked) URL.revokeObjectURL(revoked); };
  }, [media]);

  if (!media) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        Media not found
      </div>
    );
  }

  const category = getMediaTypeCategory(media.type);
  const isImage = category === "image";

  const handleCopyUrl = () => {
    const resourceUrl = normalizeUrl(media.url) || media.url;
    navigator.clipboard.writeText(resourceUrl);
    alert("URL copied to clipboard!");
  };

  const handleDownload = () => {
    const resourceUrl = normalizeUrl(media.url) || media.url;
    window.open(resourceUrl, "_blank");
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-[var(--card-bg)]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Media Details
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            {media.file_name}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              onClick={() => onEdit(media)}
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700 !text-white !border-orange-500 hover:!border-orange-600 !cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(media)}
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !text-[var(--danger)] !border-red-300 dark:!border-red-700 hover:!bg-red-100 dark:hover:!bg-red-900/20 hover:!border-red-400 dark:hover:!border-red-600 !cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Section */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Preview</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              {isImage ? (
                <img
                  src={previewSrc || normalizeUrl(media.url) || media.url}
                  alt={media.alt}
                  className="max-w-full max-h-[600px] object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/800x600?text=Image+Not+Found";
                  }}
                />
              ) : category === "video" ? (
                <video
                  src={proxiedUrl(media.url) || undefined}
                  controls
                  preload="metadata"
                  className="max-w-full max-h-[600px] rounded-lg bg-black"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-24 h-24 mx-auto text-[var(--muted-foreground)] mb-4" />
                  <p className="text-[var(--muted-foreground)]">File Preview</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    {media.file_name}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Metadata Section */}
        <div className="space-y-4">
          {/* File Info */}
          <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              File Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">File Name</p>
                <p className="text-sm font-medium text-[var(--foreground)] mt-1">
                  {media.file_name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Type</p>
                  <Badge
                    className={`mt-1 ${
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
                <div className="text-right">
                  <p className="text-xs text-[var(--muted-foreground)]">Size</p>
                  <p className="text-sm font-medium text-[var(--foreground)] mt-1">
                    {formatFileSize(media.size)}
                  </p>
                </div>
              </div>
              {media.width && media.height && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Dimensions</p>
                  <p className="text-sm font-medium text-[var(--foreground)] mt-1">
                    {media.width} × {media.height} px
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Metadata</h3>
            <div className="space-y-3">
              {media.alt && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Alt Text
                  </p>
                  <p className="text-sm text-[var(--foreground)] mt-1">{media.alt}</p>
                </div>
              )}
              {media.caption && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Caption</p>
                  <p className="text-sm text-[var(--foreground)] mt-1">{media.caption}</p>
                </div>
              )}
              {media.folder && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                    <Folder className="w-3 h-3" /> Folder
                  </p>
                  <p className="text-sm text-[var(--foreground)] mt-1">{media.folder}</p>
                </div>
              )}
              {media.tags && media.tags.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {media.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Upload Info */}
          <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              Upload Information
            </h3>
            <div className="space-y-3">
              {media.uploader && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mb-2">
                    <User className="w-3 h-3" /> Uploaded By
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(media.uploader.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-[var(--foreground)]">
                      {media.uploader.name}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> Created
                </p>
                <p className="text-sm text-[var(--foreground)]">
                  {formatDateTime(media.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" /> Updated
                </p>
                <p className="text-sm text-[var(--foreground)]">
                  {formatDateTime(media.updated_at)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

