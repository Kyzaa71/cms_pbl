"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Link2, ArrowRight } from "lucide-react";
import { RelatedEntriesProps, RelatedEntry } from "./types";
import { getRelationTypeLabel } from "./related-entries-helpers";
import { RelatedEntryCard } from "./related-entry-card";
import { relationsService } from "@/lib/services/relations-service";
import { contentService } from "@/lib/services/content-service";
import { useContentTypes } from "@/hooks/use-content";

export function RelatedEntriesList({
  entryId,
  contentTypeId,
  relationType = "related",
  limit = 6,
  direction = "outgoing",
}: RelatedEntriesProps) {
  const [relatedEntries, setRelatedEntries] = useState<RelatedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelationType, setSelectedRelationType] = useState<typeof relationType>(relationType);
  const { data: contentTypes } = useContentTypes();
  const ctNameById = (contentTypes || []).reduce<Record<number, { id: number; name: string; slug: string }>>((acc, ct) => { acc[ct.id] = { id: ct.id, name: ct.name, slug: ct.slug }; return acc; }, {});

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const rels = direction === "incoming"
          ? await relationsService.getIncomingRelations(entryId)
          : await relationsService.getRelations(entryId);
        const filtered = selectedRelationType ? rels.filter(r => r.relation_type === selectedRelationType) : rels;
        const top = filtered.slice(0, limit);
        const entries = await Promise.all(top.map(async (r) => {
          const e = await contentService.getEntry(r.to_content_id);
          const data = (e.data || {}) as Record<string, unknown>;
          const title = String(data.title || data.name || "");
          const excerpt = typeof data.excerpt === "string" ? data.excerpt : undefined;
          return {
            id: e.id,
            contentTypeId: e.content_type_id,
            contentType: ctNameById[e.content_type_id] || { id: e.content_type_id, name: `Content Type #${e.content_type_id}`, slug: String(e.content_type_id) },
            title: title || `Entry #${e.id}`,
            excerpt,
            status: e.status as any,
            relationType: r.relation_type as any,
            createdAt: String(e.created_at || ""),
            updatedAt: String(e.updated_at || ""),
            publishedAt: undefined,
            creator: undefined,
          } as RelatedEntry;
        }));
        setRelatedEntries(entries);
      } catch {
        setRelatedEntries([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [entryId, selectedRelationType, limit, direction]);

  const relationTypes: Array<{ value: typeof relationType; label: string }> = [
    { value: "related", label: "Related" },
    { value: "belongs_to", label: "Belongs To" },
    { value: "has_many", label: "Has Many" },
    { value: "has_one", label: "Has One" },
    { value: "many_to_many", label: "Many to Many" },
  ];

  return (
    <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--primary)]/10 rounded">
            <Link2 className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {direction === "incoming" ? "Referenced By" : "Related Entries"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {direction === "incoming" ? "Entries linking to this content" : "Entries related to this content"}
            </p>
          </div>
        </div>
        {relatedEntries.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {relatedEntries.length} {relatedEntries.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
      </div>

      {/* Relation Type Filter */}
      {relationType === undefined && (
        <div className="mb-4 flex flex-wrap gap-2">
          {relationTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedRelationType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRelationType(type.value)}
              className={`
                text-xs h-7 px-3
                ${
                  selectedRelationType === type.value
                    ? "!bg-[var(--primary)] !text-white"
                    : "bg-[var(--card-bg)] hover:bg-[var(--card-bg-inner)]"
                }
              `}
            >
              {type.label}
            </Button>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : relatedEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-3 bg-[var(--card-bg)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <Link2 className="w-8 h-8 text-[var(--muted-foreground)]" />
          </div>
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            No related entries found
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {selectedRelationType && `No entries with "${getRelationTypeLabel(selectedRelationType)}" relation`}
            {!selectedRelationType && "No related entries found for this content"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedEntries.map((entry) => (
            <RelatedEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* View All Link (if more entries available) */}
      {relatedEntries.length >= limit && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10"
          >
            View All Related Entries
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
}

