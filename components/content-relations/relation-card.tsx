"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ContentRelation, getRelationTypeLabel, getRelationTypeColor, formatDate } from "./types";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { ArrowRight, Link2 } from "lucide-react";

interface RelationCardProps {
  relation: ContentRelation;
  onView?: (relationId: number) => void;
  onDelete?: (relationId: number) => void;
}

export function RelationCard({ relation, onView, onDelete }: RelationCardProps) {
  return (
    <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--card-bg-inner)] transition-colors">
      <div className="flex items-center justify-between">
        {/* From Entry */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {relation.fromEntry?.title || `Entry #${relation.fromContentId}`}
            </span>
            <StatusBadge status={relation.fromEntry?.status || "draft"} />
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            {relation.fromEntry?.contentType.name || "Unknown Type"}
          </p>
        </div>

        {/* Relation Type & Arrow */}
        <div className="flex flex-col items-center gap-2 mx-4">
          <Badge className={getRelationTypeColor(relation.relationType)}>
            {getRelationTypeLabel(relation.relationType)}
          </Badge>
          <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
        </div>

        {/* To Entry */}
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <StatusBadge status={relation.toEntry?.status || "draft"} />
            <span className="text-sm font-medium text-[var(--foreground)]">
              {relation.toEntry?.title || `Entry #${relation.toContentId}`}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            {relation.toEntry?.contentType.name || "Unknown Type"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {onView && (
            <button
              onClick={() => onView(relation.id)}
              className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)] transition-colors"
              title="View Details"
            >
              <Link2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>Created: {formatDate(relation.createdAt)}</span>
        {onDelete && (
          <button
            onClick={() => onDelete(relation.id)}
            className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)] transition-colors"
            title="Delete Relation"
          >
            Delete
          </button>
        )}
      </div>
    </Card>
  );
}

