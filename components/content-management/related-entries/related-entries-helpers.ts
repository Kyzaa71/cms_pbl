// Helper functions for Related Entries feature

import { RelatedEntry, RelationType } from "./types";
import { dummyEntries, dummyContentTypes } from "@/components/search/types";
import { getEntryById } from "@/components/content-management/types";

/**
 * Generate related entries based on entryId and relationType
 * In a real app, this would fetch from: GET /search/entries/:entry_id/related?type=related
 */
export function generateRelatedEntries(
  entryId: number,
  relationType?: RelationType,
  limit: number = 6
): RelatedEntry[] {
  // Get current entry
  const currentEntry = getEntryById(entryId);
  if (!currentEntry) {
    return [];
  }

  // Mock logic: Find related entries based on various criteria
  let related: RelatedEntry[] = [];

  // Filter out current entry
  const otherEntries = dummyEntries.filter((entry) => entry.id !== entryId);

  // Mock relation logic based on different criteria
  if (relationType === "related") {
    // Related entries: Same content type or similar tags
    related = otherEntries
      .filter((entry) => {
        // Same content type
        if (entry.contentTypeId === currentEntry.contentTypeId) {
          return true;
        }
        
        // Similar tags
        if (currentEntry.tags && entry.tags) {
          const currentTags = currentEntry.tags.map((t) => t.toLowerCase());
          const entryTags = entry.tags.map((t) => t.toLowerCase());
          return currentTags.some((tag) => entryTags.includes(tag));
        }
        
        return false;
      })
      .slice(0, limit);
  } else if (relationType === "has_many") {
    // Has many: Entries that belong to this entry
    // Mock: Entries with same creator or related content type
    related = otherEntries
      .filter((entry) => {
        // Same creator
        if (entry.creator.id === currentEntry.createdBy) {
          return true;
        }
        // Related content type (child types)
        return entry.contentTypeId !== currentEntry.contentTypeId;
      })
      .slice(0, limit);
  } else if (relationType === "belongs_to") {
    // Belongs to: Parent entry (mock: older entries of same type)
    related = otherEntries
      .filter((entry) => {
        return (
          entry.contentTypeId === currentEntry.contentTypeId &&
          new Date(entry.createdAt) < new Date(currentEntry.createdAt)
        );
      })
      .slice(0, 1); // Usually one parent
  } else {
    // Default: Show related entries (same type, similar tags, or same creator)
    related = otherEntries
      .filter((entry) => {
        // Same content type
        if (entry.contentTypeId === currentEntry.contentTypeId) {
          return true;
        }
        // Same creator
        if (entry.creator.id === currentEntry.createdBy) {
          return true;
        }
        // Similar tags
        if (currentEntry.tags && entry.tags) {
          const currentTags = currentEntry.tags.map((t) => t.toLowerCase());
          const entryTags = entry.tags.map((t) => t.toLowerCase());
          return currentTags.some((tag) => entryTags.includes(tag));
        }
        return false;
      })
      .slice(0, limit);
  }

  // Convert to RelatedEntry format
  return related.map((entry) => ({
    id: entry.id,
    contentTypeId: entry.contentTypeId,
    contentType: entry.contentType,
    title: entry.title,
    excerpt: entry.excerpt,
    description: entry.description,
    status: entry.status,
    relationType: relationType || "related",
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    publishedAt: entry.publishedAt,
    creator: entry.creator,
  }));
}

/**
 * Get relation type label
 */
export function getRelationTypeLabel(type: RelationType): string {
  const labels: Record<RelationType, string> = {
    belongs_to: "Belongs To",
    has_many: "Has Many",
    has_one: "Has One",
    many_to_many: "Many to Many",
    related: "Related",
  };
  return labels[type] || type;
}

/**
 * Get relation type color for badge
 */
export function getRelationTypeColor(type: RelationType): string {
  const colors: Record<RelationType, string> = {
    belongs_to: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    has_many: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    has_one: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    many_to_many: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    related: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  };
  return colors[type] || colors.related;
}

