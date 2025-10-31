"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MediaFolder, buildFolderTree } from "./types";
import { Folder, FolderOpen, ChevronRight, ChevronDown, Plus } from "lucide-react";

interface FolderTreeProps {
  folders: MediaFolder[];
  selectedFolder?: string;
  onSelectFolder?: (folderPath: string) => void;
  onCreateFolder?: (parentId?: number) => void;
}

interface FolderNodeProps {
  folder: MediaFolder & { children?: MediaFolder[] };
  level: number;
  selectedFolder?: string;
  onSelectFolder?: (folderPath: string) => void;
  onCreateFolder?: (parentId?: number) => void;
}

function FolderNode({
  folder,
  level,
  selectedFolder,
  onSelectFolder,
  onCreateFolder,
}: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolder === folder.path;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group ${
          isSelected
            ? "bg-[var(--primary)]/20 text-[var(--primary)]"
            : "hover:bg-[var(--card-bg)] text-[var(--foreground)]"
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded);
          onSelectFolder?.(folder.path);
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-white/20 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        {isExpanded ? (
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
        ) : (
          <Folder className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="text-sm flex-1 truncate">{folder.name}</span>
        {onCreateFolder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateFolder(folder.id);
            }}
            className="p-0.5 hover:bg-[var(--primary)]/20 rounded opacity-0 group-hover:opacity-100 transition-opacity text-[var(--foreground)] hover:text-[var(--primary)]"
            title="Create subfolder"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolder={selectedFolder}
              onSelectFolder={onSelectFolder}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree({
  folders,
  selectedFolder,
  onSelectFolder,
  onCreateFolder,
}: FolderTreeProps) {
  const tree = buildFolderTree(folders);

  return (
    <Card className="p-3 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Folders</h3>
        {onCreateFolder && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateFolder(undefined)}
            className="h-7 text-xs hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
          >
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
        )}
      </div>
      <div className="space-y-0.5">
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group ${
            !selectedFolder || selectedFolder === "all"
              ? "bg-[var(--primary)]/20 text-[var(--primary)]"
              : "hover:bg-[var(--card-bg)] text-[var(--foreground)]"
          }`}
          onClick={() => onSelectFolder?.("all")}
        >
          <Folder className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">All Files</span>
        </div>
        {tree.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            selectedFolder={selectedFolder}
            onSelectFolder={onSelectFolder}
            onCreateFolder={onCreateFolder}
          />
        ))}
      </div>
    </Card>
  );
}

