// Types and dummy data for Content Relations

import { ContentEntry } from "@/components/workflow-management/types";
import { dummyEntries } from "@/components/workflow-management/types";

export type RelationType =
  | "belongs_to"
  | "has_many"
  | "has_one"
  | "many_to_many"
  | "related";

export interface ContentRelation {
  id: number;
  fromContentId: number;
  fromEntry?: ContentEntry;
  toContentId: number;
  toEntry?: ContentEntry;
  relationType: RelationType;
  createdAt: string;
  updatedAt: string;
}

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

// Initialize relations with entries populated
const initializeRelations = (): ContentRelation[] => {
  return [
    {
      id: 1,
      fromContentId: 5,
      fromEntry: dummyEntries.find((e) => e.id === 5),
      toContentId: 1,
      toEntry: dummyEntries.find((e) => e.id === 1),
      relationType: "related",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      fromContentId: 2,
      fromEntry: dummyEntries.find((e) => e.id === 2),
      toContentId: 5,
      toEntry: dummyEntries.find((e) => e.id === 5),
      relationType: "has_many",
      createdAt: "2024-01-20T09:30:00Z",
      updatedAt: "2024-01-20T09:30:00Z",
    },
    {
      id: 3,
      fromContentId: 3,
      fromEntry: dummyEntries.find((e) => e.id === 3),
      toContentId: 4,
      toEntry: dummyEntries.find((e) => e.id === 4),
      relationType: "belongs_to",
      createdAt: "2024-01-18T14:20:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
    },
    {
      id: 4,
      fromContentId: 1,
      fromEntry: dummyEntries.find((e) => e.id === 1),
      toContentId: 7,
      toEntry: dummyEntries.find((e) => e.id === 7),
      relationType: "has_one",
      createdAt: "2024-01-16T11:15:00Z",
      updatedAt: "2024-01-16T11:15:00Z",
    },
    {
      id: 5,
      fromContentId: 8,
      fromEntry: dummyEntries.find((e) => e.id === 8),
      toContentId: 9,
      toEntry: dummyEntries.find((e) => e.id === 9),
      relationType: "many_to_many",
      createdAt: "2024-01-22T16:45:00Z",
      updatedAt: "2024-01-22T16:45:00Z",
    },
    {
      id: 6,
      fromContentId: 4,
      fromEntry: dummyEntries.find((e) => e.id === 4),
      toContentId: 10,
      toEntry: dummyEntries.find((e) => e.id === 10),
      relationType: "related",
      createdAt: "2024-01-21T08:30:00Z",
      updatedAt: "2024-01-21T08:30:00Z",
    },
  ];
};

// Dummy Content Relations
export const dummyRelations: ContentRelation[] = initializeRelations();

// Helper Functions
export const getRelationsByEntryId = (entryId: number): ContentRelation[] => {
  return dummyRelations.filter((r) => r.fromContentId === entryId);
};

export const getIncomingRelationsByEntryId = (entryId: number): ContentRelation[] => {
  return dummyRelations.filter((r) => r.toContentId === entryId);
};

export const getAllRelationsByEntryId = (entryId: number): ContentRelation[] => {
  return dummyRelations.filter(
    (r) => r.fromContentId === entryId || r.toContentId === entryId
  );
};

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
export const getRelationStats = () => {
  const stats = {
    total: dummyRelations.length,
    byType: RELATION_TYPES.map((type) => ({
      type: type.value,
      label: type.label,
      count: dummyRelations.filter((r) => r.relationType === type.value).length,
    })),
  };
  return stats;
};

// Re-export ContentEntry for convenience
export type { ContentEntry };

