"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  filterMediaByType,
  filterMediaByFolder,
  searchMedia,
} from "@/components/media-assets/types";
import type { MediaFile as BackendMediaFile, MediaFolder } from "@/types/backend-models";
import type { MediaFile as UIMediaFile } from "@/components/media-assets/types";
import { MediaGrid } from "@/components/media-assets/media-grid";
import { MediaList } from "@/components/media-assets/media-list";
import { MediaFilters } from "@/components/media-assets/media-filters";
import { MediaStatsCards } from "@/components/media-assets/media-stats";
import { FolderTree } from "@/components/media-assets/folder-tree";
import { FolderCreateModal } from "@/components/media-assets/folder-create-modal";
import { Plus, Grid, List } from "lucide-react";
import { mediaService } from "@/lib/services/media-service";
import { useAuth } from "@/hooks/use-auth";

export default function AssetsPage() {
  const router = useRouter();
  const { can, getCurrentUser } = useAuth();
  const showUploadButtons = can("Media", "create");
  const showCreateFolderButton = can("Media", "create");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>("all");
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folderParentId, setFolderParentId] = useState<number | undefined>(undefined);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [allMedia, setAllMedia] = useState<BackendMediaFile[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  type MediaDashboardStats = { total_files: number; total_size_bytes: number; by_type: Record<string, number>; recent_uploads_24h: number; storage_mode?: string };
  const [stats, setStats] = useState<MediaDashboardStats>({ total_files: 0, total_size_bytes: 0, by_type: {}, recent_uploads_24h: 0, storage_mode: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => { try { await getCurrentUser(); } catch {} })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const [f, s] = await Promise.all([mediaService.listFolders(), mediaService.stats()]);
        setFolders(f);
        setStats(s);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Failed to load media data");
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const { media, meta } = await mediaService.list({ type: typeFilter === "all" ? undefined : typeFilter, folder: folderFilter === "all" ? undefined : folderFilter, search: searchQuery || undefined, page: 1, limit: 200 });
        setAllMedia(media);
        setTotalCount(meta?.total ?? media.length);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Failed to load media");
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, [typeFilter, folderFilter, searchQuery]);

  const uiMedia: UIMediaFile[] = useMemo(() => {
    return allMedia.map((m) => {
      const tags = Array.isArray(m.tags) && (m.tags as unknown[]).every((v) => typeof v === "string")
        ? (m.tags as string[])
        : undefined;
      return { ...m, tags } as UIMediaFile;
    });
  }, [allMedia]);

  const filteredMedia: UIMediaFile[] = useMemo(() => {
    let m = uiMedia;
    m = filterMediaByType(m, typeFilter);
    m = folderFilter !== "all" ? filterMediaByFolder(m, folderFilter) : m;
    m = searchMedia(m, searchQuery);
    return m;
  }, [uiMedia, typeFilter, folderFilter, searchQuery]);

  const refetchFolders = async () => {
    const f = await mediaService.listFolders();
    setFolders(f);
  };

  const handleView = (media: UIMediaFile) => {
    router.push(`/assets/${media.id}`);
  };

  const handleEdit = (media: UIMediaFile) => {
    router.push(`/assets/${media.id}/edit`);
  };

  const handleDelete = (media: UIMediaFile) => {
    if (confirm(`Are you sure you want to delete "${media.file_name}"?`)) {
      mediaService.remove(media.id).then(() => {
        setAllMedia((prev) => prev.filter((m) => m.id !== media.id));
        setTotalCount((c) => Math.max(0, c - 1));
      }).catch((e) => {
        alert(e?.message || "Failed to delete media");
      });
    }
  };

  const handleCreateFolder = (parentId?: number) => {
    setFolderParentId(parentId);
    setShowCreateFolderModal(true);
  };

  const handleFolderSubmit = (name: string) => {
    const parentId = folderParentId;
    mediaService.createFolder({ name, parent_id: parentId }).then(async () => {
      await refetchFolders();
      setShowCreateFolderModal(false);
      setFolderParentId(undefined);
    }).catch((e) => {
      alert(e?.message || "Failed to create folder");
    });
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
          {showCreateFolderButton && (
            <Button
              onClick={() => handleCreateFolder(undefined)}
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--secondary)] hover:!bg-[color-mix(in srgb, var(--secondary) 85%, black)] active:!bg-[color-mix(in srgb, var(--secondary) 75%, black)] !text-white !border-[var(--secondary)] hover:!border-[color-mix(in srgb, var(--secondary) 85%, black)] !cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Folder
            </Button>
          )}
          {showUploadButtons && (
            <Link href="/assets/upload">
              <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Media
              </Button>
            </Link>
          )}
          {showUploadButtons && (
            <Link href="/assets/upload?mode=bulk">
              <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-blue-600 hover:!bg-blue-700 active:!bg-blue-800 !text-white !border-blue-600 hover:!border-blue-700 !cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Bulk Upload
              </Button>
            </Link>
          )}
        </div>
      </div>

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

          <div className="text-sm text-[var(--muted-foreground)]">
            Showing {filteredMedia.length} of {totalCount} files
          </div>

          {/* Media Display */}
          {viewMode === "grid" ? (
            <MediaGrid
              media={filteredMedia}
              onView={handleView}
              onEdit={can("Media", "update") ? handleEdit : undefined}
              onDelete={can("Media", "delete") ? handleDelete : undefined}
            />
          ) : (
            <MediaList
              media={filteredMedia}
              onView={handleView}
              onEdit={can("Media", "update") ? handleEdit : undefined}
              onDelete={can("Media", "delete") ? handleDelete : undefined}
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
