"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, Trash2, Link2 } from "lucide-react";
import {
  dummyRelations,
  getRelationStats,
  getRelationTypeLabel,
  getRelationTypeColor,
  formatDate,
  RelationType,
} from "@/components/content-relations/types";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { RelationForm } from "@/components/content-relations/relation-form";

export default function ContentRelationsPage() {
  const router = useRouter();
  const [relations] = useState(dummyRelations);
  const [searchQuery, setSearchQuery] = useState("");
  const [relationTypeFilter, setRelationTypeFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter relations
  const filteredRelations = relations.filter((relation) => {
    const matchesSearch =
      relation.fromEntry?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relation.toEntry?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelationType =
      relationTypeFilter === "all" || relation.relationType === relationTypeFilter;
    const matchesContentType =
      contentTypeFilter === "all" ||
      relation.fromEntry?.contentTypeId.toString() === contentTypeFilter ||
      relation.toEntry?.contentTypeId.toString() === contentTypeFilter;
    return matchesSearch && matchesRelationType && matchesContentType;
  });

  // Stats
  const stats = getRelationStats();

  const handleView = (entryId: number) => {
    router.push(`/content-relations/${entryId}`);
  };

  const handleDelete = (relationId: number) => {
    if (confirm("Are you sure you want to delete this relation?")) {
      console.log("Delete relation:", relationId);
      // In real app, this would call API: DELETE /content/relations/:relation_id
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
        <Button
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] flex items-center gap-2 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Create Relation
        </Button>
      </div>

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
                      <p className="font-medium text-[var(--foreground)]">
                        {relation.fromEntry?.title || `Entry #${relation.fromContentId}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {relation.fromEntry?.contentType.name || "Unknown"}
                        </span>
                        {relation.fromEntry && (
                          <StatusBadge status={relation.fromEntry.status} />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Relation Type */}
                  <td className="py-3 px-4 text-center">
                    <Badge className={getRelationTypeColor(relation.relationType)}>
                      {getRelationTypeLabel(relation.relationType)}
                    </Badge>
                  </td>

                  {/* To Entry */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {relation.toEntry?.title || `Entry #${relation.toContentId}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {relation.toEntry?.contentType.name || "Unknown"}
                        </span>
                        {relation.toEntry && (
                          <StatusBadge status={relation.toEntry.status} />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">
                    {formatDate(relation.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      {relation.fromEntry && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(relation.fromContentId)}
                          className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                          title="View Entry Relations"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(relation.id)}
                        className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                        title="Delete Relation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Relation"
          size="lg"
        >
          <RelationForm
            onSubmit={(data) => {
              console.log("Create relation:", data);
              // In real app, this would call API: POST /content/:from_content_id/relations
              setShowCreateModal(false);
              alert(`Relation created: ${data.fromContentId} → ${data.toContentId} (${data.relationType})`);
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

