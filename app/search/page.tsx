"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  dummyEntries,
  searchEntries,
  getSearchFacets,
  type SearchParams,
  type WorkflowStatus,
} from "@/components/search/types";
import { AdvancedSearchModal } from "@/components/search/advanced-search-modal";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { SearchStats } from "@/components/search/search-stats";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "">("");
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "published_at" | "title">("created_at");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Build search params
  const searchParams: SearchParams = useMemo(() => ({
    query: searchQuery,
    content_type_ids: contentTypeFilter.length > 0 ? contentTypeFilter : undefined,
    status: statusFilter || undefined,
    tags: tagsFilter.length > 0 ? tagsFilter : undefined,
    sort_by: sortBy,
    order_by: orderBy,
    page: currentPage,
    limit: 10,
  }), [searchQuery, contentTypeFilter, statusFilter, tagsFilter, sortBy, orderBy, currentPage]);

  // Perform search
  const searchResult = useMemo(() => {
    if (!searchQuery && contentTypeFilter.length === 0 && !statusFilter && tagsFilter.length === 0) {
      return null; // Don't search if no criteria
    }
    return searchEntries(dummyEntries, searchParams);
  }, [searchQuery, contentTypeFilter, statusFilter, tagsFilter, searchParams]);

  // Get facets from all entries
  const facets = useMemo(() => getSearchFacets(dummyEntries), []);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    dummyEntries.forEach((entry) => {
      const tags = entry.data?.tags;
      if (Array.isArray(tags)) {
        tags.forEach((tag: any) => tagSet.add(String(tag)));
      }
    });
    return Array.from(tagSet).sort();
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setContentTypeFilter([]);
    setStatusFilter("");
    setTagsFilter([]);
    setCurrentPage(1);
  };

  const handleToggleContentType = (typeId: number) => {
    setContentTypeFilter((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
    setCurrentPage(1);
  };

  const handleToggleTag = (tag: string) => {
    setTagsFilter((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleStatusChange = (status: WorkflowStatus | "") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };


  const handleNavigateToEntry = (entry: any) => {
    // Navigate to appropriate detail page based on content type
    const contentTypeId = entry.contentTypeId || entry.contentType?.id;
    if (contentTypeId) {
      router.push(`/content-management/${contentTypeId}/entries/${entry.id}`);
    } else {
      // Default to workflow management
      router.push(`/workflow-management/${entry.id}`);
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    contentTypeFilter.length > 0 ||
    statusFilter ||
    tagsFilter.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] transition-colors">
            Search Content
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-2">
            Search and filter content entries across your CMS
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/search/statistics">
            <Button
              variant="outline"
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[120px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Statistics
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(true)}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Advanced Search
          </Button>
        </div>
      </div>

      {/* Main Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        contentTypeFilter={contentTypeFilter}
        tagsFilter={tagsFilter}
        onClearStatus={() => handleStatusChange("")}
        onToggleContentType={handleToggleContentType}
        onToggleTag={handleToggleTag}
        onClearAll={handleClearFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <SearchFilters
            contentTypeFilter={contentTypeFilter}
            statusFilter={statusFilter}
            tagsFilter={tagsFilter}
            allTags={allTags}
            facets={facets}
            hasActiveFilters={hasActiveFilters}
            onToggleContentType={handleToggleContentType}
            onStatusChange={handleStatusChange}
            onToggleTag={handleToggleTag}
            onClearFilters={handleClearFilters}
            onPageChange={setCurrentPage}
          />
          {/* Stats Card */}
          {searchResult && <SearchStats searchResult={searchResult} />}
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <SearchResults
            searchResult={searchResult}
            searchQuery={searchQuery}
            sortBy={sortBy}
            orderBy={orderBy}
            hasActiveFilters={hasActiveFilters}
            onSortChange={setSortBy}
            onOrderChange={setOrderBy}
            onPageChange={setCurrentPage}
            onClearFilters={handleClearFilters}
            onNavigateToEntry={handleNavigateToEntry}
          />
        </div>
      </div>

      {/* Advanced Search Modal */}
      {showAdvanced && (
        <AdvancedSearchModal
          isOpen={showAdvanced}
          onClose={() => setShowAdvanced(false)}
          onApply={(params) => {
            setSearchQuery(params.query || "");
            setContentTypeFilter(params.content_type_ids || []);
            setStatusFilter(params.status || "");
            setTagsFilter(params.tags || []);
            setSortBy(params.sort_by || "created_at");
            setOrderBy(params.order_by || "desc");
            setCurrentPage(1);
            setShowAdvanced(false);
          }}
        />
      )}
    </div>
  );
}
