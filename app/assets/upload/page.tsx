"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MediaUploadForm } from "@/components/media-assets/media-upload-form";
import type { MediaFolder } from "@/types/backend-models";
import { mediaService } from "@/lib/services/media-service";
import { useAuth } from "@/hooks/use-auth";

interface UploadFile {
  file: File;
  preview?: string;
  error?: string;
}

export default function UploadMediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || "single") as "single" | "bulk";
  const { can, getCurrentUser } = useAuth();
  const canUpload = can("Media", "create");
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  useEffect(() => {
    mediaService.listFolders().then(setFolders).catch(() => setFolders([]));
    (async () => { try { await getCurrentUser(); } catch {} })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      mediaService.upload(f, metadata).then(() => {
        router.push("/assets");
      }).catch((e) => {
        alert(e?.message || "Failed to upload file");
      });
    } else {
      const fs = files.map((x) => x.file);
      mediaService.bulkUpload(fs, metadata.folder).then(() => {
        router.push("/assets");
      }).catch((e) => {
        alert(e?.message || "Failed to upload files");
      });
    }
  };

  const handleCancel = () => {
    router.push("/assets");
  };

  if (!canUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/assets")}
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
