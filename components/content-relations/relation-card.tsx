"use client";

import { useEffect, useMemo, useState } from "react";
import { getRelationTypeLabel, getRelationTypeColor, formatDate } from "./types";
import type { ContentRelation, ContentEntry } from "@/types/backend-models";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Link2 } from "lucide-react";
import { contentService } from "@/lib/services/content-service";
import { useContentTypes } from "@/hooks/use-content";
import { StatusBadge } from "@/components/workflow-management/status-badge";

interface RelationCardProps {
  relation: ContentRelation;
  onView?: (relationId: number) => void;
  onDelete?: (relationId: number) => void;
}

export function RelationCard({ relation, onView, onDelete }: RelationCardProps) {
  const [fromEntry, setFromEntry] = useState<ContentEntry | null>(null);
  const [toEntry, setToEntry] = useState<ContentEntry | null>(null);
  const { data: contentTypes } = useContentTypes();
  const ctNameById = useMemo(() => {
    const m: Record<number, string> = {};
    for (const ct of contentTypes || []) m[ct.id] = ct.name;
    return m;
  }, [contentTypes]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const f = await contentService.getEntry(relation.from_content_id);
        const t = await contentService.getEntry(relation.to_content_id);
        if (!active) return;
        setFromEntry(f);
        setToEntry(t);
      } catch {}
    })();
    return () => { active = false; };
  }, [relation.from_content_id, relation.to_content_id]);
  return (
    <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--card-bg-inner)] transition-colors">
      <div className="flex items-center justify-between">
        {/* From Entry */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {(() => {
                const d = (fromEntry?.data || {}) as Record<string, unknown>;
                return String(d.title || d.name || `Entry #${relation.from_content_id}`);
              })()}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
            <span>{ctNameById[fromEntry?.content_type_id || 0] || (fromEntry?.content_type_id ? `Content Type #${fromEntry?.content_type_id}` : "-")}</span>
            {fromEntry && <StatusBadge status={fromEntry.status as any} />}
          </p>
        </div>

        {/* Relation Type & Arrow */}
        <div className="flex flex-col items-center gap-2 mx-4">
          <Badge className={getRelationTypeColor(relation.relation_type as any)}>
            {getRelationTypeLabel(relation.relation_type as any)}
          </Badge>
          <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
        </div>

        {/* To Entry */}
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {(() => {
                const d = (toEntry?.data || {}) as Record<string, unknown>;
                return String(d.title || d.name || `Entry #${relation.to_content_id}`);
              })()}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
            <span>{ctNameById[toEntry?.content_type_id || 0] || (toEntry?.content_type_id ? `Content Type #${toEntry?.content_type_id}` : "-")}</span>
            {toEntry && <StatusBadge status={toEntry.status as any} />}
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
        <span>Created: {formatDate(relation.created_at)}</span>
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
