"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";
import { useContentType, useContentTypes } from "@/hooks/use-content";
import { contentActions } from "@/hooks/use-content";
import { contentService } from "@/lib/services/content-service";
import { EntryForm } from "@/components/content-management/entry-form";
import type { WorkflowStatus } from "@/components/content-management/types";

export default function CreateEntryPage() {
  const params = useParams();
  const router = useRouter();
  const rawParam = params.contentTypeId as string;
  const { data: allCTs } = useContentTypes();
  const [resolvedId, setResolvedId] = useState<number | null>(null);

  useEffect(() => {
    if (!rawParam) return;
    const isNumeric = /^\d+$/.test(rawParam);
    if (isNumeric) {
      setResolvedId(parseInt(rawParam, 10));
      return;
    }
    if (allCTs && allCTs.length > 0) {
      const found = allCTs.find((ct) => ct.slug === rawParam);
      setResolvedId(found ? found.id : null);
    }
  }, [rawParam, allCTs]);

  const { data: contentType, refetch } = useContentType(resolvedId || 0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Record<string, unknown>, status: WorkflowStatus) => {
    try {
      if (!resolvedId) throw new Error("Content type not found");
      await contentService.createEntry(resolvedId, data);
      router.push(`/content-management/${resolvedId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to create entry");
    }
  };

  const handleCancel = () => {
    if (!resolvedId) {
      router.push(`/content-management`);
      return;
    }
    router.push(`/content-management/${resolvedId}`);
  };

  if (resolvedId === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-management">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Loading content type...</p>
          <Link href="/content-management">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/content-management/${resolvedId}`}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Create New {contentType.name} Entry
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Fill in the fields below to create a new entry
              </p>
            </div>
          </div>
          <Link href={`/content-management/${resolvedId}`}>
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        {error && (
          <Card className="p-3 mb-4 border border-[var(--danger)] bg-[color-mix(in srgb, var(--danger) 10%, var(--card-bg))] text-[var(--foreground)]">
            <div className="text-sm">{error}</div>
          </Card>
        )}

        {/* Empty Fields Helper */}
        {((contentType?.fields?.length || 0) + (contentType?.seo_fields?.length || 0) === 0) && (
          <Card className="p-4 mb-6 bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-[var(--foreground)] mb-3">
              This content type has no fields. Add at least one field before creating entries.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    if (!resolvedId) throw new Error("Content type not found");
                    await contentActions.addField(resolvedId, { name: "title", type: "string", required: true, is_seo: false });
                    await contentActions.addField(resolvedId, { name: "meta_title", type: "string", required: false, is_seo: true });
                    await refetch();
                  } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : String(e);
                    alert(msg || "Failed to add default fields");
                  }
                }}
              >
                Add Default Fields
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/content-builder/${resolvedId}`)}>
                Manage in Content Builder
              </Button>
            </div>
          </Card>
        )}

        {/* Form */}
        <EntryForm
          contentTypeId={resolvedId!}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}

