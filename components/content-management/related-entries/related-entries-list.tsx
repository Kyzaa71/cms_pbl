"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Link2, ArrowRight } from "lucide-react";
import { RelatedEntriesProps, RelatedEntry } from "./types";
import { generateRelatedEntries, getRelationTypeLabel, getRelationTypeColor } from "./related-entries-helpers";
import { RelatedEntryCard } from "./related-entry-card";

export function RelatedEntriesList({
  entryId,
  contentTypeId,
  relationType = "related",
  limit = 6,
}: RelatedEntriesProps) {
  const [relatedEntries, setRelatedEntries] = useState<RelatedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelationType, setSelectedRelationType] = useState<typeof relationType>(relationType);

  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would fetch from: GET /search/entries/:entry_id/related?type={relationType}
    
    // Simulate API call
    setTimeout(() => {
      const entries = generateRelatedEntries(entryId, selectedRelationType, limit);
      setRelatedEntries(entries);
      setIsLoading(false);
    }, 300);
  }, [entryId, selectedRelationType, limit]);

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
              Related Entries
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Entries related to this content
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

