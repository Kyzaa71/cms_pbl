"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { type SearchResult, type ContentEntry } from "./types";
import { SearchResultItem } from "./search-result-item";
import { SearchPagination } from "./search-pagination";

interface SearchResultsProps {
  searchResult: SearchResult | null;
  searchQuery: string;
  sortBy: "created_at" | "updated_at" | "published_at" | "title";
  orderBy: "asc" | "desc";
  hasActiveFilters: boolean;
  onSortChange: (sortBy: "created_at" | "updated_at" | "published_at" | "title") => void;
  onOrderChange: (orderBy: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onNavigateToEntry: (entry: ContentEntry) => void;
}

export function SearchResults({
  searchResult,
  searchQuery,
  sortBy,
  orderBy,
  hasActiveFilters,
  onSortChange,
  onOrderChange,
  onPageChange,
  onClearFilters,
  onNavigateToEntry,
}: SearchResultsProps) {
  // Empty state - no search performed
  if (!hasActiveFilters) {
    return (
      <Card className="p-16 text-center border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
          <Search className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Start Searching
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
          Enter a search query or use filters to find content entries across your CMS
        </p>
      </Card>
    );
  }

  // No results found
  if (!searchResult || searchResult.entries.length === 0) {
    return (
      <Card className="p-16 text-center border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Search className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          No Results Found
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find what you're looking for
        </p>
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="border-[var(--border)] hover:bg-[var(--card-bg)]"
        >
          Clear Filters
        </Button>
      </Card>
    );
  }

  // Results found
  return (
    <div className="space-y-4">
      {/* Sort & View Options */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="text-sm font-medium text-[var(--foreground)]">
          Found <span className="text-[var(--primary)] font-semibold">{searchResult.total}</span> result{searchResult.total !== 1 ? "s" : ""}
          {searchQuery && (
            <span className="text-[var(--muted-foreground)] font-normal">
              {" "}for <span className="font-semibold text-[var(--foreground)]">"{searchQuery}"</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => {
            onSortChange(value as typeof sortBy);
            onPageChange(1);
          }}>
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created Date</SelectItem>
              <SelectItem value="updated_at">Updated Date</SelectItem>
              <SelectItem value="published_at">Published Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          <Select value={orderBy} onValueChange={(value) => {
            onOrderChange(value as typeof orderBy);
            onPageChange(1);
          }}>
            <SelectTrigger className="w-[120px] border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {searchResult.entries.map((entry) => (
          <SearchResultItem
            key={entry.id}
            entry={entry}
            searchQuery={searchQuery}
            onClick={() => onNavigateToEntry(entry)}
          />
        ))}

        {/* Pagination */}
        <SearchPagination
          currentPage={searchResult.page}
          totalPages={searchResult.total_pages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

