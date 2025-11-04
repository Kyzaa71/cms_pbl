"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, FileText, Tag, X } from "lucide-react";
import {
  dummyContentTypes,
  type SearchFacets,
  type WorkflowStatus,
  getStatusLabel,
} from "./types";

interface SearchFiltersProps {
  contentTypeFilter: number[];
  statusFilter: WorkflowStatus | "";
  tagsFilter: string[];
  allTags: string[];
  facets: SearchFacets;
  hasActiveFilters: boolean;
  onToggleContentType: (typeId: number) => void;
  onStatusChange: (status: WorkflowStatus | "") => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
}

export function SearchFilters({
  contentTypeFilter,
  statusFilter,
  tagsFilter,
  allTags,
  facets,
  hasActiveFilters,
  onToggleContentType,
  onStatusChange,
  onToggleTag,
  onClearFilters,
  onPageChange,
}: SearchFiltersProps) {
  return (
    <div className="lg:col-span-1">
      <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
        {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            Filters
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-7 px-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] font-medium"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Content Type Filter */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />
            Content Types
          </label>
          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-2">
            {dummyContentTypes.map((type) => {
              const count = facets.content_types[type.name] || 0;
              const isSelected = contentTypeFilter.includes(type.id);
              return (
                <label
                  key={type.id}
                  className="flex items-center justify-between cursor-pointer p-2.5 rounded-md hover:bg-[var(--card-bg)] transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {
                        onToggleContentType(type.id);
                        onPageChange(1);
                      }}
                      className="shrink-0"
                    />
                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                      {type.name}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium shrink-0 ml-2 border-[var(--border)] bg-[var(--card-bg-inner)] text-[var(--muted-foreground)] px-2 py-0.5 ${isSelected ? 'border-[var(--primary)]/30 bg-[var(--primary)]/5' : ''}`}
                  >
                    {count.toLocaleString('en-US')}
                  </Badge>
                </label>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)] mb-6"></div>

        {/* Status Filter */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            Status
          </label>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => {
              onStatusChange(value === "all" ? "" : (value as WorkflowStatus));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-full border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft ({facets.statuses.draft || 0})</SelectItem>
              <SelectItem value="in_review">In Review ({facets.statuses.in_review || 0})</SelectItem>
              <SelectItem value="ready_for_approval">
                Ready for Approval ({facets.statuses.ready_for_approval || 0})
              </SelectItem>
              <SelectItem value="approved">Approved ({facets.statuses.approved || 0})</SelectItem>
              <SelectItem value="published">Published ({facets.statuses.published || 0})</SelectItem>
              <SelectItem value="rejected">Rejected ({facets.statuses.rejected || 0})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)] mb-6"></div>

        {/* Tags Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-[var(--muted-foreground)]" />
            Tags
          </label>
          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-2">
            {allTags.length > 0 ? (
              allTags.map((tag) => {
                const isSelected = tagsFilter.includes(tag);
                return (
                  <label
                    key={tag}
                    className="flex items-center gap-3 cursor-pointer p-2.5 rounded-md hover:bg-[var(--card-bg)] transition-colors group"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {
                        onToggleTag(tag);
                        onPageChange(1);
                      }}
                      className="shrink-0"
                    />
                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-[var(--foreground)]'}`}>
                      {tag}
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] p-2.5 italic">
                No tags available
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

