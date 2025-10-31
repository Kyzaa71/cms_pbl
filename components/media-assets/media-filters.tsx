"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { MediaFolder } from "./types";
import { Button } from "@/components/ui/button";

interface MediaFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  folderFilter: string;
  onFolderFilterChange: (folder: string) => void;
  folders?: MediaFolder[];
}

export function MediaFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  folderFilter,
  onFolderFilterChange,
  folders = [],
}: MediaFiltersProps) {
  const hasActiveFilters =
    searchQuery || typeFilter !== "all" || (folderFilter && folderFilter !== "all");

  const clearFilters = () => {
    onSearchChange("");
    onTypeFilterChange("all");
    onFolderFilterChange("all");
  };

  return (
    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search by name, alt text, or caption..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[140px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Folder Filter */}
        <Select value={folderFilter} onValueChange={onFolderFilterChange}>
          <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
            <SelectValue placeholder="Folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Folders</SelectItem>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.path}>
                {folder.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}

