"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Settings,
  FileText,
  Database,
  Code,
  RefreshCcw,
} from "lucide-react";
import { ContentType, ContentField } from "@/types/backend-models";
import { contentService } from "@/lib/services/content-service";
import { workflowService } from "@/lib/services/workflow-service";
import { useContentType } from "@/hooks/use-content";
import { FieldsList } from "@/components/content-builder/fields-list";

export default function ContentTypeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentTypeId = parseInt(params.id as string);
  
  const { data: fetchedCT, refetch: refetchCT } = useContentType(contentTypeId);
  const [contentType, setContentType] = useState<ContentType | undefined>();
  const [fields, setFields] = useState<ContentField[]>([]);
  const [entriesCount, setEntriesCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"overview" | "fields">("overview");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (fetchedCT) {
      setContentType(fetchedCT);
      const all = [
        ...(fetchedCT.fields || []),
        ...(fetchedCT.seo_fields || []),
      ] as ContentField[];
      setFields(all);
    }
  }, [fetchedCT]);

  useEffect(() => {
    let active = true;
    async function loadCount() {
      try {
        const stats = await workflowService.stats(contentTypeId).catch(() => null);
        if (stats && typeof stats.total === "number") {
          if (active) setEntriesCount(stats.total);
          return;
        }
      } catch {}
      try {
        const wf = await workflowService.entriesByStatus(contentTypeId).catch(() => []);
        if (active) setEntriesCount(Array.isArray(wf) ? wf.length : 0);
        return;
      } catch {}
      try {
        const res = await contentService.listEntries(contentTypeId, { page: 1, limit: 100 });
        if (active) setEntriesCount(Array.isArray(res.entries) ? res.entries.length : 0);
      } catch {
        if (active) setEntriesCount(0);
      }
    }
    loadCount();
    return () => { active = false; };
  }, [contentTypeId]);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await refetchCT();
      // Recount entries after refetch
      try {
        const stats = await workflowService.stats(contentTypeId).catch(() => null);
        if (stats && typeof stats.total === "number") {
          setEntriesCount(stats.total);
        } else {
          const wf = await workflowService.entriesByStatus(contentTypeId).catch(() => []);
          if (Array.isArray(wf)) setEntriesCount(wf.length);
          else {
            const res = await contentService.listEntries(contentTypeId, { page: 1, limit: 100 });
            setEntriesCount(Array.isArray(res.entries) ? res.entries.length : 0);
          }
        }
      } catch {
        setEntriesCount(0);
      }
    } finally {
      setRefreshing(false);
    }
  }

  // Check for tab query parameter on mount and when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "fields") {
      setActiveTab("fields");
      // Clean up the URL by removing the query parameter after switching
      router.replace(`/content-builder/${contentTypeId}`, { scroll: false });
    }
  }, [searchParams, contentTypeId, router]);

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-builder">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const regularFields = fields.filter((f) => !f.is_seo);
  const seoFields = fields.filter((f) => f.is_seo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/content-builder">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              {contentType.name}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Content Type Details & Configuration
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/content-builder/${contentTypeId}/edit`}>
            <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700 !text-white !border-orange-500 hover:!border-orange-600 !cursor-pointer flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/content-management?type=${contentTypeId}`}>
            <Button className="flex items-center gap-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white">
              <FileText className="w-4 h-4" />
              Manage Entries
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)]/10 rounded">
              <Database className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total Fields</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {fields.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--success)]/10 rounded">
              <FileText className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Regular Fields</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {regularFields.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--secondary)]/10 rounded">
              <Settings className="w-5 h-5 text-[var(--secondary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">SEO Fields</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {seoFields.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total Entries</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {entriesCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="border border-[var(--border)] bg-[var(--card-bg)]">
        <div className="border-b border-[var(--border)]">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "overview"
                  ? "text-[var(--primary)] border-[var(--primary)]"
                  : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("fields")}
              className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "fields"
                  ? "text-[var(--primary)] border-[var(--primary)]"
                  : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]"
              }`}
            >
              Fields ({fields.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">
                      Content Type Name
                    </p>
                    <p className="text-base font-medium text-[var(--foreground)]">
                      {contentType.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">
                      API Slug
                    </p>
                    <code className="text-sm bg-[var(--card-bg-inner)] px-2 py-1 rounded text-[var(--foreground)] border border-[var(--border)]">
                      {contentType.slug}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">
                      SEO Enabled
                    </p>
                    {contentType.enable_seo ? (
                      <Badge className="bg-[var(--success)] text-white">Enabled</Badge>
                    ) : (
                      <Badge variant="outline" className="border-[var(--border)]">
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">
                      Created At
                    </p>
                    <p className="text-base text-[var(--foreground)]">
                      {new Date(contentType.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href={`/content-builder/${contentTypeId}/fields/create`}>
                    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--primary)]/10 rounded">
                          <Plus className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[var(--foreground)]">
                            Add Field
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Create a new field
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  <Link href={`/content-management?type=${contentTypeId}`}>
                    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--success)]/10 rounded">
                          <FileText className="w-5 h-5 text-[var(--success)]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[var(--foreground)]">
                            Manage Entries
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            View all entries
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  <Link href={`/content-builder/${contentTypeId}/api-reference`}>
                    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--secondary)]/10 rounded">
                          <Code className="w-5 h-5 text-[var(--secondary)]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[var(--foreground)]">
                            API Reference
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            View API docs
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fields" && (
            <FieldsList
              contentTypeId={contentTypeId}
              fields={fields}
              onFieldsChange={setFields}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

