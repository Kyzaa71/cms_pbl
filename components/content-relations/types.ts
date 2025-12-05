// Helpers and constants for Content Relations

export type RelationType =
  | "belongs_to"
  | "has_many"
  | "has_one"
  | "many_to_many"
  | "related";

// Use backend models for relations; this file intentionally does not
// re-declare `ContentRelation` to avoid divergence.

// Relation Type Labels
export const RELATION_TYPES: { value: RelationType; label: string; description: string }[] = [
  {
    value: "belongs_to",
    label: "Belongs To",
    description: "Entry belongs to another entry",
  },
  {
    value: "has_many",
    label: "Has Many",
    description: "Entry has many related entries",
  },
  {
    value: "has_one",
    label: "Has One",
    description: "Entry has one related entry",
  },
  {
    value: "many_to_many",
    label: "Many to Many",
    description: "Bidirectional many-to-many relationship",
  },
  {
    value: "related",
    label: "Related",
    description: "General related content",
  },
];

// Get relation type label
export const getRelationTypeLabel = (type: RelationType): string => {
  const relation = RELATION_TYPES.find((r) => r.value === type);
  return relation?.label || type;
};

// Get relation type color
export const getRelationTypeColor = (type: RelationType): string => {
  const colors: Record<RelationType, string> = {
    belongs_to: "bg-blue-500 text-white",
    has_many: "bg-green-500 text-white",
    has_one: "bg-orange-500 text-white",
    many_to_many: "bg-purple-500 text-white",
    related: "bg-gray-500 text-white",
  };
  return colors[type] || "bg-gray-500 text-white";
};

// No dummy relations here; consume real backend data via services.

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get statistics
export const getRelationStats = (relations: Array<{ relation_type: RelationType }>) => {
  const total = relations.length;
  const byType = RELATION_TYPES.map((type) => ({
    type: type.value,
    label: type.label,
    count: relations.filter((r) => r.relation_type === type.value).length,
  }));
  return { total, byType };
};

// Re-export ContentEntry for convenience
export type { ContentEntry };

