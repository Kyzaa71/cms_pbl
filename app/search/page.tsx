"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, SlidersHorizontal } from "lucide-react";
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
      entry.tags?.forEach((tag) => tagSet.add(tag));
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

  const handleExport = () => {
    if (!searchResult) return;
    
    const dataStr = JSON.stringify(searchResult.entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `search-results-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleNavigateToEntry = (entry: any) => {
    // Navigate to appropriate detail page based on content type
    if (entry.contentType.slug === "blog-post") {
      router.push(`/content-management/${entry.contentType.slug}/${entry.id}`);
    } else if (entry.contentType.slug === "product") {
      router.push(`/content-management/${entry.contentType.slug}/${entry.id}`);
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
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Search Content
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Search and filter content entries across your CMS
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(true)}
            className="flex items-center gap-2 border-[var(--border)] hover:bg-[var(--card-bg)] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Advanced Search
          </Button>
          {searchResult && (
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2 border-[var(--border)] hover:bg-[var(--card-bg)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
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
