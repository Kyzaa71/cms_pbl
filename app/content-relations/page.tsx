"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, Trash2, Link2 } from "lucide-react";
import { getRelationStats, getRelationTypeLabel, getRelationTypeColor, formatDate, RelationType } from "@/components/content-relations/types";
import type { ContentRelation } from "@/types/backend-models";
import { RelationForm } from "@/components/content-relations/relation-form";
import { EntrySelector } from "@/components/content-relations/entry-selector";
import { relationsService } from "@/lib/services/relations-service";
import { contentService } from "@/lib/services/content-service";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { getStatusLabel } from "@/components/workflow-management/types";
import { useContentTypes } from "@/hooks/use-content";
import { useAuth } from "@/hooks/use-auth";
import { searchService } from "@/lib/services/search-service";

export default function ContentRelationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { can, user, getCurrentUser } = useAuth();
  const roleName = (user?.role?.name || "").toLowerCase();
  const canModifyRelations = can("ContentEntry", "update") && roleName !== "seo_specialist";
  const [relations, setRelations] = useState<ContentRelation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [relationTypeFilter, setRelationTypeFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fromEntryId, setFromEntryId] = useState<number>(0);
  const [entryMap, setEntryMap] = useState<Record<number, any>>({});
  const { data: contentTypes } = useContentTypes();
  const ctNameById = useMemo(() => {
    const m: Record<number, string> = {};
    for (const ct of contentTypes || []) m[ct.id] = ct.name;
    return m;
  }, [contentTypes]);

  const titleOf = (e: any, fallbackId: number) => {
    const d = (e?.data || {}) as Record<string, unknown>;
    const keys = ["title", "name", "headline", "meta_title"];
    for (const k of keys) {
      const v = d[k];
      if (typeof v === "string" && v.trim().length > 0) return v as string;
    }
    for (const [k, v] of Object.entries(d)) {
      if (typeof v === "string" && v.trim().length > 0) return v as string;
    }
    return `Entry #${fallbackId}`;
  };

  useEffect(() => {
    const fromParam = Number(searchParams.get("from") || 0);
    if (fromParam && fromParam > 0) setFromEntryId(fromParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Do not persist or enforce the `from` param; keep the page clean by default
  }, [fromEntryId]);

  useEffect(() => {
    const load = async () => {
      try {
        if (fromEntryId && fromEntryId > 0) {
          const list = await relationsService.getRelations(fromEntryId);
          setRelations(list);
        } else {
          const { entries } = await searchService.fullText({ q: "", limit: 25, page: 1 });
          const rels = await Promise.all(entries.map((e) => relationsService.getRelations(e.id)));
          setRelations(rels.flat());
        }
      } catch {
        setRelations([]);
      }
    };
    load();
  }, [fromEntryId]);

  useEffect(() => {
    const ids = Array.from(new Set(relations.flatMap(r => [r.from_content_id, r.to_content_id])));
    if (ids.length === 0) return;
    let active = true;
    (async () => {
      const results = await Promise.allSettled(ids.map(id => contentService.getEntry(id)));
      if (!active) return;
      const map: Record<number, any> = {};
      results.forEach((res, idx) => { if (res.status === "fulfilled") map[ids[idx]!] = res.value; });
      setEntryMap(map);
    })();
    return () => { active = false; };
  }, [relations]);

  // Filter relations
  const filteredRelations = useMemo(() => {
    const qq = searchQuery.trim().toLowerCase();
    return relations.filter((relation) => {
      const fe = entryMap[relation.from_content_id];
      const te = entryMap[relation.to_content_id];
      const fromTitle = titleOf(fe, relation.from_content_id).toLowerCase();
      const toTitle = titleOf(te, relation.to_content_id).toLowerCase();
      const fromCt = (ctNameById[fe?.content_type_id || 0] || "").toLowerCase();
      const toCt = (ctNameById[te?.content_type_id || 0] || "").toLowerCase();
      const fromStatus = fe ? getStatusLabel(fe.status).toLowerCase() : "";
      const toStatus = te ? getStatusLabel(te.status).toLowerCase() : "";
      const matchesSearch = !qq ||
        fromTitle.includes(qq) || toTitle.includes(qq) ||
        fromCt.includes(qq) || toCt.includes(qq) ||
        fromStatus.includes(qq) || toStatus.includes(qq);
      const matchesRelationType = relationTypeFilter === "all" || relation.relation_type === relationTypeFilter;
      const matchesContentType = contentTypeFilter === "all";
      return matchesSearch && matchesRelationType && matchesContentType;
    });
  }, [relations, searchQuery, relationTypeFilter, contentTypeFilter, entryMap, ctNameById]);

  // Stats
  const stats = getRelationStats(relations as any);

  const handleView = (entryId: number) => {
    router.push(`/content-relations/${entryId}`);
  };

  const handleDelete = async (relationId: number) => {
    if (!confirm("Are you sure you want to delete this relation?")) return;
    if (!canModifyRelations) { alert("no permission"); return; }
    try {
      await relationsService.deleteRelation(relationId);
      setRelations((prev) => prev.filter((r) => r.id !== relationId));
    } catch (e) {
      alert("no permission");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Content Relations
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage relationships and connections between content entries
          </p>
        </div>
        {canModifyRelations && (
          <Button
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] flex items-center gap-2 transition-colors"
            onClick={() => setShowCreateModal(true)}
            >
            <Plus className="w-4 h-4" />
            Create Relation
          </Button>
        )}
      </div>

      {/* Select From Entry (optional) */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between gap-3">
          <EntrySelector
            value={fromEntryId}
            onChange={setFromEntryId}
            label="From Entry (optional)"
            placeholder="Search for source entry..."
          />
          <div className="mt-6 flex items-center gap-2">
            <Button variant="outline" onClick={() => setFromEntryId(0)} className="text-sm">
              Show All Relations
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Relations</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <Link2 className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        {stats.byType.map((stat) => (
          <Card
            key={stat.type}
            className="p-4 bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-inner)] border border-[var(--border)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                  {stat.count}
                </p>
              </div>
              <Badge className={getRelationTypeColor(stat.type as RelationType)}>
                {stat.label}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by entry title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            />
          </div>

          {/* Relation Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <Select value={relationTypeFilter} onValueChange={setRelationTypeFilter}>
              <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                <SelectValue placeholder="Relation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="belongs_to">Belongs To</SelectItem>
                <SelectItem value="has_many">Has Many</SelectItem>
                <SelectItem value="has_one">Has One</SelectItem>
                <SelectItem value="many_to_many">Many to Many</SelectItem>
                <SelectItem value="related">Related</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Relations Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">From Entry</th>
              <th className="py-3 px-4 font-medium text-center">Relation</th>
              <th className="py-3 px-4 font-medium">To Entry</th>
              <th className="py-3 px-4 font-medium">Created</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRelations.length > 0 ? (
              filteredRelations.map((relation, index) => (
                <tr
                  key={relation.id}
                  className={`border-t border-[var(--border)] ${
                    index % 2 === 0
                      ? "bg-[var(--card-bg-inner)]"
                      : "bg-[var(--card-bg)]"
                  } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
                >
                  {/* From Entry */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{titleOf(entryMap[relation.from_content_id], relation.from_content_id)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {ctNameById[entryMap[relation.from_content_id]?.content_type_id || 0] || (entryMap[relation.from_content_id]?.content_type_id ? `Content Type #${entryMap[relation.from_content_id]?.content_type_id}` : "-")}
                        </span>
                        {entryMap[relation.from_content_id] && (
                          <StatusBadge status={entryMap[relation.from_content_id].status as any} />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Relation Type */}
                  <td className="py-3 px-4 text-center">
                    <Badge className={getRelationTypeColor(relation.relation_type as RelationType)}>
                      {getRelationTypeLabel(relation.relation_type as RelationType)}
                    </Badge>
                  </td>

                  {/* To Entry */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{titleOf(entryMap[relation.to_content_id], relation.to_content_id)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {ctNameById[entryMap[relation.to_content_id]?.content_type_id || 0] || (entryMap[relation.to_content_id]?.content_type_id ? `Content Type #${entryMap[relation.to_content_id]?.content_type_id}` : "-")}
                        </span>
                        {entryMap[relation.to_content_id] && (
                          <StatusBadge status={entryMap[relation.to_content_id].status as any} />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">
                    {formatDate(relation.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(relation.from_content_id)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                        title="View Entry Relations"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canModifyRelations && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(relation.id)}
                          className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                          title="Delete Relation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No relations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Relation Modal */}
      {showCreateModal && canModifyRelations && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Relation"
          size="lg"
        >
          <RelationForm
            fromContentId={fromEntryId || undefined}
            onSubmit={async (data) => {
              try {
                const created = await relationsService.createRelation(data.fromContentId, { to_content_id: data.toContentId, relation_type: data.relationType });
                setRelations((prev) => [created, ...prev]);
                setFromEntryId(data.fromContentId);
                setShowCreateModal(false);
              } catch (e) {
                alert("no permission");
              }
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
