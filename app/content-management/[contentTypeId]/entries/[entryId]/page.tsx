"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, X, Pencil, FileText, Search } from "lucide-react";
import { getStatusBadgeColor, getStatusLabel } from "@/components/content-management/types";
import { contentService } from "@/lib/services/content-service";
import { mediaService } from "@/lib/services/media-service";
import { useContentType } from "@/hooks/use-content";
import { ContentEntry, ContentType, MediaFile, User } from "@/types/backend-models";
import { EntryForm } from "@/components/content-management/entry-form";
import { SEOPreviewModal } from "@/components/content-management/seo-preview/seo-preview-modal";
import { RelatedEntriesList } from "@/components/content-management/related-entries/related-entries-list";
import { useAuth } from "@/hooks/use-auth";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBaseUrl } from "@/lib/api-client";
import { projectService } from "@/lib/services/project-service";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { can } = useAuth();
  const contentTypeId = parseInt(params.contentTypeId as string);
  const entryId = parseInt(params.entryId as string);

  const [entry, setEntry] = useState<ContentEntry | undefined>();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("project_id");
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  const { data: contentType } = useContentType(contentTypeId, projectId);
  const initialEditing = useMemo(() => searchParams.get("mode") === "edit", [searchParams]);
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [showSEOPreview, setShowSEOPreview] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState<string>("en");
  const [mediaMap, setMediaMap] = useState<Record<number, MediaFile>>({});
  const [imgPreviewMap, setImgPreviewMap] = useState<Record<string, string>>({});
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const BASE_URL = getBaseUrl();
  const [projectRoleName, setProjectRoleName] = useState<string>("");

  const normalizeUrl = useMemo(() => {
    return (url?: string): string | null => {
      if (!url) return null;
      const cleaned = url.trim().replace(/[\\]+/g, "/");
      if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
      if (cleaned.startsWith("/")) return `${BASE_URL}${cleaned}`;
      return `${BASE_URL}/${cleaned}`;
    };
  }, [BASE_URL]);

  const proxiedUrl = useMemo(() => {
    return (url?: string): string | null => {
      const u = normalizeUrl(url);
      return u ? `/api/media-proxy?url=${encodeURIComponent(u)}` : null;
    };
  }, [normalizeUrl]);

  useEffect(() => {
    contentService.getEntry(entryId).then((e) => setEntry(e));
  }, [entryId]);

  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!projectId || !entryId) { setProjectRoleName(""); return; }
      try {
        // Find current user membership in this project
        const members = await projectService.getProjectMembers(Number(projectId));
        const me = members.find((m) => typeof m.user_id === "number");
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    fetchRole();
    return () => { active = false; };
  }, [projectId, entryId]);

  useEffect(() => {
    const loadMedia = async () => {
      const dataObj = (entry?.data || {}) as Record<string, unknown>;
      const ids = Object.entries(dataObj)
        .filter(([k, v]) => typeof v === "number" && /image|media/i.test(k))
        .map(([, v]) => Number(v))
        .filter((id) => Number.isFinite(id) && !(id in mediaMap));
      if (ids.length === 0) return;
      const results = await Promise.allSettled(ids.map((id) => mediaService.getById(id)));
      const next: Record<number, MediaFile> = { ...mediaMap };
      results.forEach((res, idx) => {
        const id = ids[idx]!;
        if (res.status === "fulfilled") next[id] = res.value;
      });
      setMediaMap(next);
    };
    loadMedia();
  }, [entry, mediaMap]);

  useEffect(() => {
    const loadPreviews = async () => {
      if (!entry) return;
      const dataObj = (entry.data || {}) as Record<string, unknown>;
      const targets: Array<{ key: string; url: string | null }> = [];
      Object.entries(dataObj).forEach(([key, value]) => {
        const isImageId = typeof value === "number" && /image|media/i.test(key);
        const isImagePath = typeof value === "string" && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(value);
        let url: string | null = null;
        if (isImageId) {
          const mf = mediaMap[Number(value)];
          url = proxiedUrl(mf?.url);
        } else if (isImagePath) {
          url = proxiedUrl(String(value));
        }
        if (url && !(key in imgPreviewMap)) {
          targets.push({ key, url });
        }
      });
      if (targets.length === 0) return [] as string[];
      const revoked: string[] = [];
      const results: Array<[string, string | null]> = targets.map((t) => [t.key, t.url]);
      const next = { ...imgPreviewMap };
      results.forEach(([k, url]) => { if (url) next[k] = url; });
      setImgPreviewMap(next);
      return revoked;
    };
    let created: string[] = [];
    (async () => { created = await loadPreviews(); })();
    return () => { Array.isArray(created) && created.forEach((u) => { try { URL.revokeObjectURL(u); } catch {} }); };
  }, [entry, mediaMap, normalizeUrl, imgPreviewMap]);

  const handleUpdate = async (data: Record<string, unknown>) => {
    try {
      if (!contentType) {
        throw new Error("Content type not loaded");
      }
      const allFields = [
        ...((contentType as any).fields || []),
        ...((contentType as any).seo_fields || []),
      ];
      const validFieldNames = new Set<string>(allFields.map((f: any) => String(f.name)));
      const filteredData: Record<string, unknown> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (validFieldNames.has(key) || key.endsWith("_media_id")) {
          filteredData[key] = value;
        }
      });
      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields to update");
      }
      const updated = await contentService.updateEntry(entryId, filteredData);
      setEntry(updated);
      setIsEditing(false);
      alert("Entry updated successfully");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update entry";
      alert(`Update failed: ${msg}`);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!contentType || !entry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Entry not found</p>
          <Link
            href={
              projectId
                ? `/organizational/${projectId}/workspace/entries/${contentTypeId}?project_id=${projectId}`
                : `/content-management/${contentTypeId}`
            }
          >
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Entries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const creator: User | undefined = entry?.creator;
  const updater: User | undefined = entry?.updater;
  const dataObj = (entry.data || {}) as Record<string, unknown>;
  const title = String(dataObj.title || dataObj.name || `${contentType?.name} #${entry.id}`);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={
                projectId
                  ? `/organizational/${projectId}/workspace/entries/${contentTypeId}?project_id=${projectId}`
                  : `/content-management/${contentTypeId}`
              }
            >
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {isEditing ? `Edit ${contentType.name} Entry` : title}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                {contentType.name} Entry Details
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                {contentType?.enableSeo && (
                  <Button
                    onClick={() => setShowSEOPreview(true)}
                    className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-teal-500 hover:!bg-teal-600 active:!bg-teal-700 !text-white !border-teal-500 hover:!border-teal-600 !cursor-pointer flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    SEO Preview
                  </Button>
                )}
                <Button
                  disabled={generatingPreview}
                  onClick={async () => {
                    try {
                      setGeneratingPreview(true);
                      const { token } = await contentService.previewToken(entryId);
                      const origin = typeof window !== "undefined" ? window.location.origin : "";
                      const target = `${origin}/preview?entry_id=${entryId}&token=${encodeURIComponent(token)}`;
                      window.open(target, "_blank", "noopener,noreferrer");
                    } catch (e) {
                      alert((e as Error)?.message || "Failed to open preview");
                    } finally {
                      setGeneratingPreview(false);
                    }
                  }}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-purple-600 hover:!bg-purple-700 active:!bg-purple-800 !text-white !border-purple-600 hover:!border-purple-700 !cursor-pointer flex items-center gap-2"
                >
                  {generatingPreview ? "Generating..." : "Entry Preview"}
                </Button>
                <Button
                  onClick={() => setShowTranslate(true)}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-blue-600 hover:!bg-blue-700 active:!bg-blue-800 !text-white !border-blue-600 hover:!border-blue-700 !cursor-pointer flex items-center gap-2"
                >
                  Translate
                </Button>
                {(can("ContentEntry", "update") || (!!projectId && ["projectadmin","projecteditor","projectcontentwriter"].includes((projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "")))) && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700 !text-white !border-orange-500 hover:!border-orange-600 !cursor-pointer flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Content
                </Button>
                )}
                {false && (
                  <Link href={`/workflow-management/${entryId}`}>
                    <Button className="flex items-center gap-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white">
                      <FileText className="w-4 h-4" />
                      Manage Workflow
                    </Button>
                  </Link>
                )}
              </>
            )}
            <Link
              href={
                projectId
                  ? `/organizational/${projectId}/workspace/entries/${contentTypeId}?project_id=${projectId}`
                  : `/content-management/${contentTypeId}`
              }
            >
              <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
                <X className="w-5 h-5 text-[var(--muted-foreground)]" />
              </button>
            </Link>
          </div>
        </div>

        {/* Entry Info */}
        {!isEditing && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Status</p>
                <Badge className={`${getStatusBadgeColor(entry.status)} border-none`}>
                  {getStatusLabel(entry.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Created</p>
                <p className="text-sm text-[var(--foreground)]">{new Date(entry.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Updated</p>
                <p className="text-sm text-[var(--foreground)]">{new Date(entry.updated_at).toLocaleDateString()}</p>
              </div>
              {entry.published_at && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Published</p>
                  <p className="text-sm text-[var(--foreground)]">{new Date(entry.published_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Creator & Updater */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
              {(() => {
                const creator: User | undefined = entry?.creator;
                if (!creator) return null;
                return (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">Created By</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={creator.profile || ""} alt={creator.name || ""} />
                      <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)]">
                        {creator.name?.slice(0,1)?.toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {(creator.name?.slice(0,1)?.toUpperCase() || "")} {creator.name} - {creator.email}
                    </p>
                  </div>
                </div>
              )})()}
              {updater && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">Updated By</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={(entry?.updater as User | undefined)?.profile || ""} alt={(entry?.updater as User | undefined)?.name || ""} />
                      <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)]">
                        {(entry?.updater as User | undefined)?.name?.slice(0,2)?.toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {(entry?.updater as User | undefined)?.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {(entry?.updater as User | undefined)?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form or View */}
        {isEditing ? (
          <EntryForm
            contentTypeId={contentTypeId}
            entryId={entryId}
            projectId={projectId}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        ) : (
          <div className="space-y-4">
            {(Object.entries((entry.data || {}) as Record<string, unknown>)).map(([key, value]) => {
              const isImageId = typeof value === "number" && /image|media/i.test(key);
              const media = isImageId ? mediaMap[Number(value)] : undefined;
              const isImagePath = typeof value === "string" && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(value);
              return (
                <div key={key} className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                  <p className="text-sm font-medium text-[var(--muted-foreground)] mb-1 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  {media && media.type?.startsWith("image/") ? (
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--card-bg-inner)] border border-[var(--border)]">
                        <img src={imgPreviewMap[key] || "https://via.placeholder.com/96x96?text=Image"} alt={media.alt || media.file_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm text-[var(--foreground)]">
                        <p className="font-medium truncate max-w-[240px]">{media.file_name}</p>
                        <p className="text-[var(--muted-foreground)]">{media.type}</p>
                      </div>
                    </div>
                  ) : isImagePath ? (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--card-bg-inner)] border border-[var(--border)]">
                      <img src={imgPreviewMap[key] || "https://via.placeholder.com/96x96?text=Image"} alt={String(value)} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <p className="text-base text-[var(--foreground)]">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Related Entries (Outgoing) */}
      {entry && (
        <RelatedEntriesList
          entryId={entryId}
          contentTypeId={contentTypeId}
          relationType={undefined}
          direction="outgoing"
          limit={6}
        />
      )}

      {/* Referenced By (Incoming) */}
      {entry && (
        <RelatedEntriesList
          entryId={entryId}
          contentTypeId={contentTypeId}
          relationType={undefined}
          direction="incoming"
          limit={6}
        />
      )}

      {/* SEO Preview Modal */}
      {contentType?.enable_seo && entry && (
        <SEOPreviewModal
          entryId={entryId}
          contentTypeId={contentTypeId}
          entry={entry}
          contentType={contentType}
          isOpen={showSEOPreview}
          onClose={() => setShowSEOPreview(false)}
        />
      )}

      {/* Translate Modal */}
      {showTranslate && (
        <Modal
          isOpen={showTranslate}
          onClose={() => setShowTranslate(false)}
          title="Translate Entry"
          size="sm"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">Target Language</p>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-full border-[var(--border)] bg-[var(--input-bg)]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (en)</SelectItem>
                  <SelectItem value="id">Indonesian (id)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTranslate(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const updated = await contentService.translateEntry(entryId, { target_lang: targetLang });
                  setEntry(updated);
                  setShowTranslate(false);
                  alert(`Translated to ${targetLang}`);
                }}
                className="!bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
              >
                Translate
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
