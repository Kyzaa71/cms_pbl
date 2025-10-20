"use client";

import { useState } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Music,
  File,
  CheckCircle,
} from "lucide-react";

export default function UploadAssetsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    setSuccess(false);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setSuccess(true);
    setFiles([]);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return <ImageIcon className="w-8 h-8 text-[var(--primary)]" />;
    if (type.startsWith("audio/"))
      return <Music className="w-8 h-8 text-[var(--warning)]" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-8 h-8 text-[var(--danger)]" />;
    return <File className="w-8 h-8 text-[var(--muted-foreground)]" />;
  };

  return (
    <div className="p-8 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Breadcrumb */}
      <p className="text-sm text-[var(--muted-foreground)] mb-1">
        Pages /{" "}
        <span className="text-[var(--foreground)] font-medium">
          Upload New Assets
        </span>
      </p>

      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Upload New Assets</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Add new media files to your content library
          </p>
        </div>
      </div>

      {/* ✅ Success Message */}
      {success && (
        <div className="mb-6 flex items-center gap-2 bg-[var(--success)]/10 text-[var(--success)] px-4 py-2 rounded-lg text-sm font-medium shadow-sm w-fit border border-[var(--success)]/30">
          <CheckCircle className="w-4 h-4" /> Upload successful!
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
          isDragging
            ? "border-[var(--primary)] bg-[var(--card-bg)]"
            : "border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg-inner)]"
        }`}
      >
        <Upload className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-3" />
        <p className="text-[var(--foreground)] font-medium">
          Drag & Drop files here
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          or click below to browse from your device
        </p>

        <label
          htmlFor="file-upload"
          className="inline-block mt-2 px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] text-sm rounded-md transition"
        >
          Browse Files
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* File Preview Section */}
      {files.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Files to Upload ({files.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="border border-[var(--border)] bg-[var(--card-bg-inner)] rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col items-center relative"
              >
                <button
                  onClick={() =>
                    setFiles(files.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 text-[var(--muted-foreground)] hover:text-[var(--danger)]"
                >
                  <X className="w-4 h-4" />
                </button>

                {getFileIcon(file.type)}

                <p className="mt-3 text-sm font-medium text-[var(--foreground)] truncate w-full text-center">
                  {file.name}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {file.type || "Unknown type"}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setFiles([])}
              className="px-4 py-2 text-sm border border-[var(--border)] text-[var(--foreground)] rounded-md hover:bg-[var(--card-bg)] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-5 py-2 text-sm bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] rounded-md shadow transition"
            >
              Upload Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
