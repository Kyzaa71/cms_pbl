"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Filter,
  Layers,
  FileText,
  Database,
} from "lucide-react";
import { ContentType } from "@/types/backend-models";
import { useContentTypes, contentActions } from "@/hooks/use-content";
import { contentService } from "@/lib/services/content-service";
import { workflowService } from "@/lib/services/workflow-service";

export default function ContentBuilderPage() {
  const router = useRouter();
  const { data: serverContentTypes } = useContentTypes();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [seoFilter, setSeoFilter] = useState<string>("all");
  const [entriesCountByCT, setEntriesCountByCT] = useState<Record<number, number>>({});

  useEffect(() => {
    setContentTypes(serverContentTypes || []);
  }, [serverContentTypes]);

  useEffect(() => {
    let active = true;
    async function loadCounts() {
      const map: Record<number, number> = {};
      for (const ct of serverContentTypes || []) {
        try {
          const stats = await workflowService.stats(ct.id).catch(() => null);
          if (stats && typeof stats.total === "number") {
            map[ct.id] = stats.total;
            continue;
          }
        } catch {}
        try {
          const wf = await workflowService.entriesByStatus(ct.id).catch(() => []);
          if (Array.isArray(wf) && wf.length >= 0) {
            map[ct.id] = wf.length;
            continue;
          }
        } catch {}
        try {
          const res = await contentService.listEntries(ct.id, { page: 1, limit: 100 });
          map[ct.id] = Array.isArray(res.entries) ? res.entries.length : 0;
        } catch {
          map[ct.id] = 0;
        }
      }
      if (active) setEntriesCountByCT(map);
    }
    loadCounts();
    return () => { active = false; };
  }, [serverContentTypes]);

  // Filter content types
  const filteredContentTypes = contentTypes.filter((ct) => {
    const matchesSearch =
      ct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ct.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeo =
      seoFilter === "all" ||
      (seoFilter === "enabled" && ct.enable_seo) ||
      (seoFilter === "disabled" && !ct.enable_seo);
    return matchesSearch && matchesSeo;
  });

  // Stats
  const stats = useMemo(() => ({
    total: contentTypes.length,
    withSeo: contentTypes.filter((ct) => ct.enable_seo).length,
    totalFields: contentTypes.reduce((sum, ct) => sum + (ct.fields?.length || 0) + (ct.seo_fields?.length || 0), 0),
    totalEntries: contentTypes.reduce((sum, ct) => sum + (entriesCountByCT[ct.id] || 0), 0),
  }), [contentTypes, entriesCountByCT]);

  // Handlers
  const handleView = (contentTypeId: number) => {
    router.push(`/content-builder/${contentTypeId}`);
  };

  const handleEdit = (contentTypeId: number) => {
    router.push(`/content-builder/${contentTypeId}/edit`);
  };

  const handleManageEntries = (contentTypeId: number) => {
    router.push(`/content-management?type=${contentTypeId}`);
  };

  const handleDelete = async (contentType: ContentType) => {
    try {
      const res = await contentService.listEntries(contentType.id, { page: 1, limit: 1 });
      const total = res.meta?.total || 0;
      if (total > 0) {
        alert(`Cannot delete "${contentType.name}" because it has ${total} entry${total !== 1 ? "s" : ""}. Please delete or reassign entries first.`);
        return;
      }
    } catch {
      // continue, assume no entries when meta unavailable
    }

    if (!confirm(`Are you sure you want to delete "${contentType.name}"?`)) return;
    try {
      await contentActions.deleteContentType(contentType.id);
      setContentTypes((prev) => prev.filter((ct) => ct.id !== contentType.id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg || "Failed to delete content type");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Content Builder
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Create and manage content types, fields, and schemas for your CMS
          </p>
        </div>
        <Link href="/content-builder/create">
          <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Content Type
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            />
          </div>

          {/* SEO Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <Select value={seoFilter} onValueChange={setSeoFilter}>
              <SelectTrigger className="w-[160px] border-[var(--border)] bg-[var(--input-bg)]">
                <SelectValue placeholder="SEO Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="enabled">SEO Enabled</SelectItem>
                <SelectItem value="disabled">SEO Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Content Types</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <Layers className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[var(--success)] to-[var(--success-hover)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">With SEO</p>
              <p className="text-2xl font-bold mt-1">{stats.withSeo}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[var(--secondary)] to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Fields</p>
              <p className="text-2xl font-bold mt-1">{stats.totalFields}</p>
            </div>
            <Database className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Entries</p>
              <p className="text-2xl font-bold mt-1">{stats.totalEntries}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Content Types Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Slug</th>
              <th className="py-3 px-4 font-semibold">Fields</th>
              <th className="py-3 px-4 font-semibold">Entries</th>
              <th className="py-3 px-4 font-semibold">SEO</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--card-bg-inner)]">
            {filteredContentTypes.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No content types found. Create your first content type to get started.
                </td>
              </tr>
            ) : (
              filteredContentTypes.map((contentType, index) => (
                <tr
                  key={contentType.id}
                  className={`border-t border-[var(--border)] ${
                    index % 2 === 0
                      ? "bg-[var(--card-bg-inner)]"
                      : "bg-[var(--card-bg)]"
                  } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
                >
                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-[var(--foreground)]">
                      {contentType.name}
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3 px-4">
                    <code className="text-xs bg-[var(--card-bg)] px-2 py-1 rounded text-[var(--muted-foreground)] border border-[var(--border)]">
                      {contentType.slug}
                    </code>
                  </td>

                  {/* Fields */}
                  <td className="py-3 px-4 text-[var(--foreground)]">
                    {(contentType.fields?.length || 0) + (contentType.seo_fields?.length || 0)}
                  </td>

                  {/* Entries */}
                  <td className="py-3 px-4 text-[var(--foreground)]">
                    {entriesCountByCT[contentType.id] || 0}
                  </td>

                  {/* SEO */}
                  <td className="py-3 px-4">
                    {contentType.enable_seo ? (
                      <Badge className="bg-[var(--success)] text-white border-none">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)]">
                        Disabled
                      </Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(contentType.id)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contentType.id)}
                        className="text-yellow-600 hover:text-[color-mix(in srgb, yellow 80%, black)] dark:text-yellow-500"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleManageEntries(contentType.id)}
                        className="text-blue-600 hover:text-[color-mix(in srgb, blue 80%, black)] dark:text-blue-500"
                        title="Manage Entries"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contentType)}
                        className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
