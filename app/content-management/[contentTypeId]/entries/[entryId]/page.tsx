"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, X, Pencil, FileText, Search } from "lucide-react";
import { getContentTypeById } from "@/components/content-builder/types";
import {
  getEntryById,
  getEntryTitle,
  getStatusBadgeColor,
  getStatusLabel,
  formatDate,
  type ContentEntry,
  type WorkflowStatus,
  dummyUsers,
} from "@/components/content-management/types";
import { getInitials } from "@/components/user-management/types";
import { EntryForm } from "@/components/content-management/entry-form";
import { SEOPreviewModal } from "@/components/content-management/seo-preview/seo-preview-modal";
import { RelatedEntriesList } from "@/components/content-management/related-entries/related-entries-list";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeId = parseInt(params.contentTypeId as string);
  const entryId = parseInt(params.entryId as string);

  const [entry, setEntry] = useState<ContentEntry | undefined>();
  const [contentType, setContentType] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSEOPreview, setShowSEOPreview] = useState(false);

  useEffect(() => {
    const ct = getContentTypeById(contentTypeId);
    setContentType(ct);

    const entryData = getEntryById(entryId);
    setEntry(entryData);
  }, [contentTypeId, entryId]);

  const handleUpdate = (data: Record<string, any>, status: WorkflowStatus) => {
    // In a real app, this would call: PUT /content/entries/:entry_id
    // Note: Status is preserved from existing entry, not changed here
    console.log("Update entry:", {
      entryId,
      data,
      status: entry?.status, // Preserve existing status
    });

    // Update local state - preserve existing status
    if (entry) {
      setEntry({
        ...entry,
        data,
        status: entry.status, // Keep existing status - workflow changes happen elsewhere
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!contentType || !entry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Entry not found</p>
          <Link href={`/content-management/${contentTypeId}`}>
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Entries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const creator = entry.creator || dummyUsers.find((u) => u.id === entry.createdBy);
  const updater = entry.updater || (entry.updatedBy ? dummyUsers.find((u) => u.id === entry.updatedBy) : undefined);
  const title = getEntryTitle(entry);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/content-management/${contentTypeId}`}>
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
                  onClick={() => setIsEditing(true)}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700 !text-white !border-orange-500 hover:!border-orange-600 !cursor-pointer flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Content
                </Button>
                <Link href={`/workflow-management/${entryId}`}>
                  <Button
                    className="flex items-center gap-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
                  >
                    <FileText className="w-4 h-4" />
                    Manage Workflow
                  </Button>
                </Link>
              </>
            )}
            <Link href={`/content-management/${contentTypeId}`}>
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
                <p className="text-sm text-[var(--foreground)]">
                  {formatDate(entry.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Updated</p>
                <p className="text-sm text-[var(--foreground)]">
                  {formatDate(entry.updatedAt)}
                </p>
              </div>
              {entry.publishedAt && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Published</p>
                  <p className="text-sm text-[var(--foreground)]">
                    {formatDate(entry.publishedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Creator & Updater */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
              {creator && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">Created By</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)]">
                        {getInitials(creator.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {creator.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {creator.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {updater && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">Updated By</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={updater.avatar} alt={updater.name} />
                      <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)]">
                        {getInitials(updater.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {updater.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {updater.email}
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
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(entry.data).map(([key, value]) => (
              <div key={key} className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--muted-foreground)] mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-base text-[var(--foreground)]">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Related Entries */}
      {entry && (
        <RelatedEntriesList
          entryId={entryId}
          contentTypeId={contentTypeId}
          relationType="related"
          limit={6}
        />
      )}

      {/* SEO Preview Modal */}
      {contentType?.enableSeo && entry && (
        <SEOPreviewModal
          entryId={entryId}
          contentTypeId={contentTypeId}
          entry={entry}
          contentType={contentType}
          isOpen={showSEOPreview}
          onClose={() => setShowSEOPreview(false)}
        />
      )}
    </div>
  );
}

