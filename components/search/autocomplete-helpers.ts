// Helper functions for Autocomplete feature

import { ContentEntry, dummyEntries, dummyContentTypes, getEntryTitle } from "./types";
import { AutocompleteSuggestion, AutocompleteParams } from "./types";

/**
 * Generate autocomplete suggestions from entries
 * In a real app, this would fetch from: GET /search/autocomplete?field=title&prefix=te&content_type_id=1&limit=10
 */
export function generateAutocompleteSuggestions(
  params: AutocompleteParams
): AutocompleteSuggestion[] {
  const { field, prefix, contentTypeId, limit = 10 } = params;

  if (!prefix || prefix.length < 2) {
    return [];
  }

  const prefixLower = prefix.toLowerCase();
  const suggestions = new Map<string, AutocompleteSuggestion>();

  // Filter entries by content type if specified
  let filteredEntries = dummyEntries;
  if (contentTypeId) {
    filteredEntries = dummyEntries.filter((entry) => entry.contentTypeId === contentTypeId);
  }

  // Extract unique suggestions from field
  filteredEntries.forEach((entry) => {
    let fieldValue: string | undefined;

          // Try to get value from entry data or entry properties
          if (field === "title") {
            fieldValue = getEntryTitle(entry);
          } else if (field === "description") {
            fieldValue = entry.data.description || entry.data.excerpt || '';
          } else if (entry.data && entry.data[field]) {
            fieldValue = String(entry.data[field]);
          }

    if (fieldValue) {
      const valueLower = fieldValue.toLowerCase();
      
      // Check if field value starts with prefix
      if (valueLower.startsWith(prefixLower)) {
        const key = fieldValue.toLowerCase();
        
        // Only add if not already exists (for uniqueness)
        if (!suggestions.has(key)) {
          suggestions.set(key, {
            text: fieldValue,
            field: field,
            contentTypeId: entry.contentTypeId,
            contentTypeName: entry.contentType.name,
          });

          // Stop if we've reached the limit
          if (suggestions.size >= limit) {
            return;
          }
        }
      }
    }
  });

  return Array.from(suggestions.values()).slice(0, limit);
}

/**
 * Debounce function for autocomplete
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Highlight matching text in suggestion
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-900/50 font-semibold'>$1</mark>");
}

