"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaFile, MediaFolder } from "./types";

interface MediaEditFormProps {
  media: MediaFile;
  folders: MediaFolder[];
  onSave: (data: {
    alt: string;
    caption: string;
    folder: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
}

export function MediaEditForm({ media, folders, onSave, onCancel }: MediaEditFormProps) {
  const [alt, setAlt] = useState(media.alt || "");
  const [caption, setCaption] = useState(media.caption || "");
  const [folder, setFolder] = useState(media.folder || "");
  const [tags, setTags] = useState(media.tags?.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      alt: alt.trim(),
      caption: caption.trim(),
      folder: folder || "",
      tags: tagsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file-name">File Name</Label>
        <Input
          id="file-name"
          value={media.file_name}
          disabled
          className="mt-1 bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted-foreground)]"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          File name cannot be changed
        </p>
      </div>

      <div>
        <Label htmlFor="alt">
          Alt Text <span className="text-[var(--danger)]">*</span>
        </Label>
        <Input
          id="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Enter alt text for accessibility"
          required
          className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Required for accessibility
        </p>
      </div>

      <div>
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter caption"
          rows={3}
          className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
        />
      </div>

      <div>
        <Label htmlFor="folder">Folder</Label>
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

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma-separated tags"
          className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Separate multiple tags with commas
        </p>
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
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}

