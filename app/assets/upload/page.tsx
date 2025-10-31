"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MediaUploadForm } from "@/components/media-assets/media-upload-form";
import { dummyFolders } from "@/components/media-assets/types";

interface UploadFile {
  file: File;
  preview?: string;
  error?: string;
}

export default function UploadMediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || "single") as "single" | "bulk";

  const handleUpload = (
    files: UploadFile[],
    metadata: {
      folder?: string;
      alt?: string;
      caption?: string;
      tags?: string[];
    }
  ) => {
    console.log("Upload files:", files, metadata);
    // In real app, this would call API: POST /media/upload or POST /media/bulk-upload
    alert(
      `Successfully uploaded ${files.length} file(s)${metadata.folder ? ` to ${metadata.folder}` : ""}`
    );
    router.push("/assets");
  };

  const handleCancel = () => {
    router.push("/assets");
  };

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
          folders={dummyFolders}
          onUpload={handleUpload}
          onCancel={handleCancel}
          mode={mode}
        />
      </div>
    </div>
  );
}
