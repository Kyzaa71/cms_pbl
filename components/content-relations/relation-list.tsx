"use client";

import type { ContentRelation } from "@/types/backend-models";
import { RelationCard } from "./relation-card";

interface RelationListProps {
  relations: ContentRelation[];
  onView?: (relationId: number) => void;
  onDelete?: (relationId: number) => void;
  showActions?: boolean;
}

export function RelationList({
  relations,
  onView,
  onDelete,
  showActions = true,
}: RelationListProps) {
  if (relations.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        No relations found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relations.map((relation) => (
        <RelationCard
          key={relation.id}
          relation={relation}
          onView={showActions ? onView : undefined}
          onDelete={showActions ? onDelete : undefined}
        />
      ))}
    </div>
  );
}

