// Types and dummy data for Search feature
// Aligned with backend: backend/internal/search/service.go

import { ContentEntry, WorkflowStatus, dummyEntries, dummyUsers } from "@/components/content-management/types";
import { ContentType, dummyContentTypes, getContentTypeById, getFieldsByContentTypeId } from "@/components/content-builder/types";

// ==========================================
// SEARCH PARAMETERS (aligned with backend SearchParams)
// ==========================================
export interface SearchParams {
  query?: string;
  content_type_ids?: number[];
  fields?: string[];
  status?: WorkflowStatus;
  created_by?: number;
  tags?: string[];
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "updated_at" | "published_at" | "title";
  order_by?: "asc" | "desc";
}

// ==========================================
// SEARCH RESULT (aligned with backend SearchResult)
// ==========================================
export interface SearchResult {
  entries: ContentEntry[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  query?: string;
  facets?: SearchFacets;
}

// ==========================================
// SEARCH FACETS (aligned with backend SearchFacets)
// ==========================================
export interface SearchFacets {
  content_types: Record<string, number>;
  statuses: Record<WorkflowStatus, number>;
  date_range?: {
    oldest: string;
    newest: string;
  };
}

// ==========================================
// AUTOCOMPLETE TYPES
// ==========================================
export interface AutocompleteSuggestion {
  text: string;
  field: string;
  contentTypeId?: number;
  contentTypeName?: string;
}

export interface AutocompleteParams {
  field: string;
  prefix: string;
  contentTypeId?: number;
  limit?: number;
}

// ==========================================
// EXPORT TYPES FOR USE IN COMPONENTS
// ==========================================
export type { ContentEntry, WorkflowStatus };
export { dummyEntries, dummyUsers, dummyContentTypes, getContentTypeById };

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Get status badge color class
 */
export function getStatusBadgeColor(status: WorkflowStatus): string {
  const colors: Record<WorkflowStatus, string> = {
    draft: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    in_review: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    ready_for_approval: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    published: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
    rejected: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };
  return colors[status] || colors.draft;
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: WorkflowStatus): string {
  const labels: Record<WorkflowStatus, string> = {
    draft: "Draft",
    in_review: "In Review",
    ready_for_approval: "Ready for Approval",
    approved: "Approved",
    published: "Published",
    rejected: "Rejected",
  };
  return labels[status] || status;
}

/**
 * Highlight search query in text
 */
export function highlightText(text: string, query: string): string {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(
    regex,
    "<mark class='bg-yellow-200 dark:bg-yellow-900/50 font-semibold px-0.5 rounded'>$1</mark>"
  );
}

/**
 * Extract title from ContentEntry
 */
export function getEntryTitle(entry: ContentEntry): string {
  // Try common title fields first
  if (entry.data.title) return String(entry.data.title);
  if (entry.data.name) return String(entry.data.name);
  
  // Try to find title field from content type fields
  if (entry.contentType) {
    const fields = getFieldsByContentTypeId(entry.contentTypeId);
    const titleField = fields.find(
      (f) => f.name.toLowerCase().includes('title') || f.name.toLowerCase().includes('name')
    );
    if (titleField && entry.data[titleField.name]) {
      return String(entry.data[titleField.name]);
    }
  }
  
  return `${entry.contentType?.name || 'Entry'} #${entry.id}`;
}

/**
 * Extract description/excerpt from ContentEntry
 */
export function getEntryDescription(entry: ContentEntry): string {
  if (entry.data.description) return String(entry.data.description);
  if (entry.data.excerpt) return String(entry.data.excerpt);
  if (entry.data.body) {
    const body = String(entry.data.body);
    return body.length > 150 ? body.substring(0, 150) + '...' : body;
  }
  return '';
}

/**
 * Extract tags from ContentEntry
 */
export function getEntryTags(entry: ContentEntry): string[] {
  if (entry.data?.tags && Array.isArray(entry.data.tags)) {
    return entry.data.tags.map((t: any) => String(t));
  }
  return [];
}

/**
 * Search entries with filters (mock implementation)
 * In real app, this would call: GET /search/entries or POST /search/advanced
 */
export function searchEntries(
  entries: ContentEntry[],
  params: SearchParams
): SearchResult {
  // Ensure entries have contentType populated
  const entriesWithContentType = entries.map(entry => {
    if (!entry.contentType) {
      entry.contentType = getContentTypeById(entry.contentTypeId);
    }
    return entry;
  });

  let filtered = [...entriesWithContentType];

  // Filter by content type
  if (params.content_type_ids && params.content_type_ids.length > 0) {
    filtered = filtered.filter((e) => params.content_type_ids!.includes(e.contentTypeId));
  }

  // Filter by status
  if (params.status) {
    filtered = filtered.filter((e) => e.status === params.status);
  }

  // Filter by creator
  if (params.created_by) {
    filtered = filtered.filter((e) => e.createdBy === params.created_by);
  }

  // Filter by tags
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter((e) => {
      const entryTags = getEntryTags(e);
      return params.tags!.some((tag) => entryTags.includes(tag));
    });
  }

  // Filter by date range
  if (params.from_date) {
    filtered = filtered.filter((e) => e.createdAt >= params.from_date!);
  }
  if (params.to_date) {
    filtered = filtered.filter((e) => e.createdAt <= params.to_date!);
  }

  // Full-text search
  if (params.query) {
    const queryLower = params.query.toLowerCase();
    filtered = filtered.filter((e) => {
      const title = getEntryTitle(e).toLowerCase();
      const description = getEntryDescription(e).toLowerCase();
      return title.includes(queryLower) || description.includes(queryLower);
    });
  }

  // Sort
  const sortBy = params.sort_by || "created_at";
  const orderBy = params.order_by || "desc";
  filtered.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortBy) {
      case "title":
        aVal = getEntryTitle(a).toLowerCase();
        bVal = getEntryTitle(b).toLowerCase();
        break;
      case "updated_at":
        aVal = new Date(a.updatedAt).getTime();
        bVal = new Date(b.updatedAt).getTime();
        break;
      case "published_at":
        aVal = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        bVal = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        break;
      default: // created_at
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
    }

    if (orderBy === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    entries: paginated,
    total,
    page,
    limit,
    total_pages: totalPages,
    query: params.query,
  };
}

/**
 * Get search facets from entries
 * In real app, this would call: GET /search/facets
 */
export function getSearchFacets(entries: ContentEntry[]): SearchFacets {
  // Ensure entries have contentType populated
  const entriesWithContentType = entries.map(entry => {
    if (!entry.contentType) {
      entry.contentType = getContentTypeById(entry.contentTypeId);
    }
    return entry;
  });

  const facets: SearchFacets = {
    content_types: {},
    statuses: {
      draft: 0,
      in_review: 0,
      ready_for_approval: 0,
      approved: 0,
      published: 0,
      rejected: 0,
    },
  };

  entriesWithContentType.forEach((entry) => {
    // Count by content type
    const typeName = entry.contentType?.name || 'Unknown';
    facets.content_types[typeName] = (facets.content_types[typeName] || 0) + 1;

    // Count by status
    if (facets.statuses[entry.status] !== undefined) {
      facets.statuses[entry.status]++;
    }
  });

  return facets;
}





