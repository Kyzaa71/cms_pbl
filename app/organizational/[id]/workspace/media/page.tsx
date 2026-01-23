"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { mediaService } from "@/lib/services/media-service";
import type { MediaFile as BackendMediaFile, MediaFolder } from "@/types/backend-models";
import type { MediaFile as UIMediaFile, MediaStats } from "@/components/media-assets/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MediaGrid } from "@/components/media-assets/media-grid";
import { MediaList } from "@/components/media-assets/media-list";
import { MediaFilters } from "@/components/media-assets/media-filters";
import { MediaStatsCards } from "@/components/media-assets/media-stats";
import { FolderTree } from "@/components/media-assets/folder-tree";
import { FolderCreateModal } from "@/components/media-assets/folder-create-modal";
import { Plus, Grid, List } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { projectService } from "@/lib/services/project-service";

export default function OrgMediaPage() {
  const router = useRouter();
  const { can, user, getCurrentUser } = useAuth();
  const params = useParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const projectId = useMemo(() => Number(idParam), [idParam]);

  const [projectRoleName, setProjectRoleName] = useState<string>("");
  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!projectId || !user?.id) { setProjectRoleName(""); return; }
      try {
        const members = await projectService.getProjectMembers(projectId);
        const me = members.find((m) => m.user_id === user.id);
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    fetchRole();
    return () => { active = false; };
  }, [projectId, user?.id]);
  const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const showUploadButtons = ["projectadmin", "projecteditor", "projectcontentwriter"].includes(projectRoleKey);
  const showCreateFolderButton = ["projectadmin", "projecteditor", "projectcontentwriter"].includes(projectRoleKey);

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
  const [stats, setStats] = useState<MediaStats>({ total_files: 0, total_size_bytes: 0, by_type: {}, recent_uploads_24h: 0, storage_mode: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => { try { await getCurrentUser(); } catch { } })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const [f, s] = await Promise.all([mediaService.listFolders(projectId), mediaService.stats(projectId)]);
        setFolders(f);
        setStats(s as MediaStats);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Failed to load media data");
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [projectId]);

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const { media, meta } = await mediaService.list({
          type: typeFilter === "all" ? undefined : typeFilter,
          folder: folderFilter === "all" ? undefined : folderFilter,
          search: searchQuery || undefined,
          page: 1,
          limit: 200,
          project_id: projectId,
        });
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
  }, [typeFilter, folderFilter, searchQuery, projectId]);

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
    // filterMediaByType and filterMediaByFolder are used inside MediaFilters; here we just slice based on filters
    if (typeFilter !== "all") m = m.filter((mm) => mm.file_type === typeFilter);
    if (folderFilter !== "all") m = m.filter((mm) => (mm.folder || "") === folderFilter);
    if (searchQuery.trim()) {
      const qq = searchQuery.trim().toLowerCase();
      m = m.filter((mm) => (mm.file_name || "").toLowerCase().includes(qq));
    }
    return m;
  }, [uiMedia, typeFilter, folderFilter, searchQuery]);

  const refetchFolders = async () => {
    const f = await mediaService.listFolders(projectId);
    setFolders(f);
  };

  const handleView = (media: UIMediaFile) => {
    router.push(`/assets/${media.id}`);
  };

  const handleEdit = (media: UIMediaFile) => {
    router.push(`/organizational/${projectId}/workspace/media/${media.id}/edit`);
  };

  const handleDelete = (media: UIMediaFile) => {
    if (confirm(`Are you sure you want to delete "${media.file_name}"?`)) {
      mediaService.remove(media.id, projectId).then(() => {
        setAllMedia((prev) => prev.filter((m) => m.id !== media.id));
        setTotalCount((c) => Math.max(0, c - 1));
      }).catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Failed to delete media";
        alert(msg);
      });
    }
  };

  const handleCreateFolder = (parentId?: number) => {
    setFolderParentId(parentId);
    setShowCreateFolderModal(true);
  };

  const handleFolderSubmit = (name: string) => {
    const parentId = folderParentId;
    mediaService.createFolder({ name, parent_id: parentId, project_id: projectId }).then(async () => {
      await refetchFolders();
      setShowCreateFolderModal(false);
      setFolderParentId(undefined);
    }).catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : "Failed to create folder";
      alert(msg);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Media Library
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage and organize your project media assets
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
            <Link href={`/organizational/${projectId}/workspace/media/upload`}>
              <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Media
              </Button>
            </Link>
          )}
          {showUploadButtons && (
            <Link href={`/organizational/${projectId}/workspace/media/upload-bulk`}>
              <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-blue-600 hover:!bg-blue-700 active:!bg-blue-800 !text-white !border-blue-600 hover:!border-blue-700 !cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Bulk Upload
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-[var(--danger)] bg-[var(--card-bg-inner)] border border-[var(--border)] rounded-md p-2">
          {error}
        </div>
      )}

      <MediaStatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

        <div className="lg:col-span-3 space-y-4">
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

          {viewMode === "grid" ? (
            <MediaGrid
              media={filteredMedia}
              onView={handleView}
              onEdit={(["projectadmin", "projecteditor"].includes(projectRoleKey)) ? handleEdit : undefined}
              onDelete={(projectRoleKey === "projectadmin") ? handleDelete : undefined}
            />
          ) : (
            <MediaList
              media={filteredMedia}
              onView={handleView}
              onEdit={(["projectadmin", "projecteditor"].includes(projectRoleKey)) ? handleEdit : undefined}
              onDelete={(projectRoleKey === "projectadmin") ? handleDelete : undefined}
            />
          )}
        </div>
      </div>

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
