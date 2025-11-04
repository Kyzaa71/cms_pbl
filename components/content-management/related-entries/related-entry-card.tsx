"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { RelatedEntry } from "./types";
import { getRelationTypeLabel, getRelationTypeColor } from "./related-entries-helpers";
import { getStatusBadgeColor, getStatusLabel, formatDate } from "@/components/search/types";

interface RelatedEntryCardProps {
  entry: RelatedEntry;
  onView?: (entryId: number) => void;
}

export function RelatedEntryCard({ entry, onView }: RelatedEntryCardProps) {
  const router = useRouter();

  const handleView = () => {
    if (onView) {
      onView(entry.id);
    } else {
      // Default navigation
      router.push(`/content-management/${entry.contentTypeId}/entries/${entry.id}`);
    }
  };

  return (
    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all duration-200 hover:shadow-md">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 mb-1">
              {entry.title}
            </h4>
            {entry.contentType && (
              <p className="text-xs text-[var(--muted-foreground)]">
                {entry.contentType.name}
              </p>
            )}
          </div>
          <Badge
            className={`${getRelationTypeColor(entry.relationType)} border text-xs px-2 py-0.5 flex-shrink-0`}
          >
            {getRelationTypeLabel(entry.relationType)}
          </Badge>
        </div>

        {/* Excerpt */}
        {entry.excerpt && (
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
            {entry.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusBadgeColor(entry.status)} border-none text-xs`}>
              {getStatusLabel(entry.status)}
            </Badge>
            <span className="text-xs text-[var(--muted-foreground)]">
              {formatDate(entry.createdAt)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            className="h-7 px-2 text-xs hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </div>
    </Card>
  );
}

