"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaFolder } from "./types";
import { Folder } from "lucide-react";

interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  parentFolder?: MediaFolder;
  folders: MediaFolder[];
}

export function FolderCreateModal({
  isOpen,
  onClose,
  onSubmit,
  parentFolder,
  folders,
}: FolderCreateModalProps) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    // Check for duplicate names in the same parent
    const existingNames = folders
      .filter((f) => f.parent_id === parentFolder?.id)
      .map((f) => f.name.toLowerCase());
    
    if (existingNames.includes(folderName.trim().toLowerCase())) {
      setError("A folder with this name already exists");
      return;
    }

    // Validate folder name (no special characters, no slashes)
    const namePattern = /^[a-zA-Z0-9_-]+$/;
    if (!namePattern.test(folderName.trim())) {
      setError("Folder name can only contain letters, numbers, underscores, and hyphens");
      return;
    }

    onSubmit(folderName.trim());
    setFolderName("");
    setError("");
  };

  const handleClose = () => {
    setFolderName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={parentFolder ? "Create Subfolder" : "Create Folder"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {parentFolder && (
          <div className="bg-[var(--card-bg)] rounded-lg p-3 border border-[var(--border)]">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Folder className="w-4 h-4" />
              <span>Parent: {parentFolder.path}</span>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="folder-name">
            Folder Name <span className="text-[var(--danger)]">*</span>
          </Label>
          <Input
            id="folder-name"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter folder name"
            required
            className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            autoFocus
          />
          {error && <p className="text-sm text-[var(--danger)] mt-1">{error}</p>}
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Use letters, numbers, underscores, or hyphens only
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer"
          >
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
}

