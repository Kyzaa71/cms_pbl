"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { dummyContentTypes, type WorkflowStatus } from "./types";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: WorkflowStatus | "";
  contentTypeFilter: number[];
  tagsFilter: string[];
  onClearStatus: () => void;
  onToggleContentType: (typeId: number) => void;
  onToggleTag: (tag: string) => void;
  onClearAll: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  contentTypeFilter,
  tagsFilter,
  onClearStatus,
  onToggleContentType,
  onToggleTag,
  onClearAll,
}: SearchBarProps) {
  const hasActiveFilters = statusFilter || contentTypeFilter.length > 0 || tagsFilter.length > 0;

  return (
    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
        <Input
          placeholder="Search by title, description, or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12 text-base border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-full p-0.5 hover:bg-[var(--card-bg)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filters Row */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
          {statusFilter && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--secondary)]/10 text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20 transition-colors"
            >
              Status: {statusFilter}
              <button
                onClick={onClearStatus}
                className="ml-0.5 hover:bg-[var(--secondary)]/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {contentTypeFilter.map((typeId) => {
            const type = dummyContentTypes.find((t) => t.id === typeId);
            return (
              <Badge 
                key={typeId} 
                variant="secondary"
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--primary)]/20 transition-colors"
              >
                {type?.name}
                <button
                  onClick={() => onToggleContentType(typeId)}
                  className="ml-0.5 hover:bg-[var(--primary)]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          {tagsFilter.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-[var(--foreground)] border border-[var(--border)] hover:bg-purple-500/20 transition-colors"
            >
              {tag}
              <button
                onClick={() => onToggleTag(tag)}
                className="ml-0.5 hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]"
          >
            Clear all
          </Button>
        </div>
      )}
    </Card>
  );
}

