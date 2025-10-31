"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MediaFolder, formatFileSize } from "./types";
import { Upload, X, File, Image as ImageIcon, Video, FileText } from "lucide-react";

interface UploadFile {
  file: File;
  preview?: string;
  error?: string;
}

interface MediaUploadFormProps {
  folders: MediaFolder[];
  onUpload: (files: UploadFile[], metadata: {
    folder?: string;
    alt?: string;
    caption?: string;
    tags?: string[];
  }) => void;
  onCancel: () => void;
  mode?: "single" | "bulk";
}

export function MediaUploadForm({
  folders,
  onUpload,
  onCancel,
  mode = "single",
}: MediaUploadFormProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [folder, setFolder] = useState<string>("");
  const [alt, setAlt] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const videoMaxSize = 100 * 1024 * 1024; // 100MB

    const newFiles: UploadFile[] = [];
    const newErrors: string[] = [];

    selectedFiles.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const maxAllowedSize = isVideo ? videoMaxSize : maxSize;

      if (file.size > maxAllowedSize) {
        newErrors.push(
          `${file.name} is too large (max ${formatFileSize(maxAllowedSize)})`
        );
        return;
      }

      const uploadFile: UploadFile = { file };
      if (file.type.startsWith("image/")) {
        uploadFile.preview = URL.createObjectURL(file);
      }
      newFiles.push(uploadFile);
    });

    if (mode === "single" && newFiles.length > 1) {
      newErrors.push("Please select only one file");
      setFiles([]);
    } else {
      setFiles((prev) => (mode === "single" ? newFiles : [...prev, ...newFiles]));
    }
    setErrors(newErrors);
  };

  const removeFile = (index: number) => {
    const file = files[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrors(["Please select at least one file"]);
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onUpload(files, {
      folder: folder || undefined,
      alt: alt || undefined,
      caption: caption || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    });

    // Cleanup preview URLs
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });

    // Reset form
    setFiles([]);
    setFolder("");
    setAlt("");
    setCaption("");
    setTags("");
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (type.startsWith("video/")) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <Label className="text-[var(--foreground)] font-medium mb-4 block">
          {mode === "single" ? "Select File" : "Select Files"}
        </Label>
        <div
          className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--primary)] transition-colors bg-[var(--card-bg)]"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
          <p className="text-[var(--foreground)] mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {mode === "single"
              ? "Images up to 10MB, Videos up to 100MB"
              : "Multiple files supported"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple={mode === "bulk"}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,application/pdf"
          />
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((uploadFile, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-md border border-[var(--border)]"
              >
                {uploadFile.preview ? (
                  <img
                    src={uploadFile.preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--card-bg-inner)] rounded">
                    {getFileIcon(uploadFile.file.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            {errors.map((error, idx) => (
              <p key={idx} className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            ))}
          </div>
        )}
      </Card>

      {/* Metadata */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="folder">Folder (Optional)</Label>
          <Select value={folder || "root"} onValueChange={(value) => setFolder(value === "root" ? "" : value)}>
            <SelectTrigger className="mt-1 border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Select folder or leave empty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Root (No folder)</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f.id} value={f.path}>
                  {f.path}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mode === "single" && (
          <>
            <div>
              <Label htmlFor="alt">Alt Text (Optional)</Label>
              <Input
                id="alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Enter alt text for accessibility"
                className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter caption"
                rows={3}
                className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="tags">Tags (Optional)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags (e.g., product, hero, marketing)"
            className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Separate multiple tags with commas
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={files.length === 0}
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--primary)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload {files.length > 0 ? `(${files.length})` : ""}
        </Button>
      </div>
    </form>
  );
}

