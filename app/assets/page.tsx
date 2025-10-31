"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  dummyMediaFiles,
  dummyFolders,
  filterMediaByType,
  filterMediaByFolder,
  searchMedia,
  calculateStats,
  MediaFile,
  MediaFolder,
} from "@/components/media-assets/types";
import { MediaGrid } from "@/components/media-assets/media-grid";
import { MediaList } from "@/components/media-assets/media-list";
import { MediaFilters } from "@/components/media-assets/media-filters";
import { MediaStatsCards } from "@/components/media-assets/media-stats";
import { FolderTree } from "@/components/media-assets/folder-tree";
import { FolderCreateModal } from "@/components/media-assets/folder-create-modal";
import { Plus, Grid, List } from "lucide-react";

export default function AssetsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>("all");
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folderParentId, setFolderParentId] = useState<number | undefined>(undefined);
  const [folders, setFolders] = useState<MediaFolder[]>(dummyFolders);

  // Filter media
  let filteredMedia = dummyMediaFiles;
  filteredMedia = filterMediaByType(filteredMedia, typeFilter);
  filteredMedia = folderFilter !== "all" ? filterMediaByFolder(filteredMedia, folderFilter) : filteredMedia;
  filteredMedia = searchMedia(filteredMedia, searchQuery);

  // Calculate stats
  const stats = calculateStats(dummyMediaFiles);

  const handleView = (media: MediaFile) => {
    router.push(`/assets/${media.id}`);
  };

  const handleEdit = (media: MediaFile) => {
    router.push(`/assets/${media.id}/edit`);
  };

  const handleDelete = (media: MediaFile) => {
    if (confirm(`Are you sure you want to delete "${media.file_name}"?`)) {
      console.log("Delete media:", media.id);
      // In real app, this would call API: DELETE /media/:id
    }
  };

  const handleCreateFolder = (parentId?: number) => {
    setFolderParentId(parentId);
    setShowCreateFolderModal(true);
  };

  const handleFolderSubmit = (name: string) => {
    const parentId = folderParentId;
    console.log("Create folder:", name, parentId);
    // In real app, this would call API: POST /media/folders
    // Body: { name, parent_id: parentId }
    
    // Simulate folder creation for demo
    const newFolder: MediaFolder = {
      id: folders.length + 1,
      name: name,
      path: parentId 
        ? folders.find(f => f.id === parentId)?.path + "/" + name || `/${name}`
        : `/${name}`,
      parent_id: parentId,
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setFolders([...folders, newFolder]);
    setShowCreateFolderModal(false);
    setFolderParentId(undefined);
    alert(`Folder "${name}" created${parentId ? ` in parent folder` : " at root"}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Media Library
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage and organize your media assets
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleCreateFolder(undefined)}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--secondary)] hover:!bg-[color-mix(in srgb, var(--secondary) 85%, black)] active:!bg-[color-mix(in srgb, var(--secondary) 75%, black)] !text-white !border-[var(--secondary)] hover:!border-[color-mix(in srgb, var(--secondary) 85%, black)] !cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Folder
          </Button>
          <Link href="/assets/upload">
            <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload Media
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <MediaStatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Folder Tree */}
        <div className="lg:col-span-1">
          <FolderTree
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={(path) => {
              setSelectedFolder(path);
              setFolderFilter(path === "all" ? "all" : path);
            }}
            onCreateFolder={handleCreateFolder}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between gap-4">
            <MediaFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              folderFilter={folderFilter}
              onFolderFilterChange={setFolderFilter}
              folders={folders}
            />
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-[var(--muted-foreground)]">
            Showing {filteredMedia.length} of {dummyMediaFiles.length} files
          </div>

          {/* Media Display */}
          {viewMode === "grid" ? (
            <MediaGrid
              media={filteredMedia}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <MediaList
              media={filteredMedia}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <FolderCreateModal
          isOpen={showCreateFolderModal}
          onClose={() => {
            setShowCreateFolderModal(false);
            setFolderParentId(undefined);
          }}
          onSubmit={handleFolderSubmit}
          parentFolder={folderParentId ? folders.find(f => f.id === folderParentId) : undefined}
          folders={folders}
        />
      )}
    </div>
  );
}
