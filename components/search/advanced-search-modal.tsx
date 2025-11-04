"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { Search, FileText, Filter, Calendar, Tag, User, ArrowUpDown } from "lucide-react";
import {
  dummyContentTypes,
  dummyUsers,
  type SearchParams,
  type WorkflowStatus,
} from "./types";

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (params: SearchParams) => void;
}

export function AdvancedSearchModal({
  isOpen,
  onClose,
  onApply,
}: AdvancedSearchModalProps) {
  const [query, setQuery] = useState("");
  const [contentTypeIds, setContentTypeIds] = useState<number[]>([]);
  const [status, setStatus] = useState<WorkflowStatus | "">("");
  const [tags, setTags] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<number | undefined>();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "published_at" | "title">("created_at");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");

  const handleToggleContentType = (typeId: number) => {
    setContentTypeIds((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleApply = () => {
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onApply({
      query,
      content_type_ids: contentTypeIds.length > 0 ? contentTypeIds : undefined,
      status: status || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      created_by: createdBy,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      sort_by: sortBy,
      order_by: orderBy,
    });
  };

  const handleReset = () => {
    setQuery("");
    setContentTypeIds([]);
    setStatus("");
    setTags("");
    setCreatedBy(undefined);
    setFromDate("");
    setToDate("");
    setSortBy("created_at");
    setOrderBy("desc");
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Advanced Search
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Refine your search with detailed filters
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Search Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">
                Search Query
              </h3>
            </div>
            <div>
              <Label htmlFor="query" className="text-sm font-medium text-[var(--foreground)]">
                Keywords
              </Label>
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search keywords..."
                className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </section>

          {/* Content Filters Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">
                Content Filters
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Types */}
              <div>
                <Label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                  <FileText className="w-4 h-4 inline mr-1.5 text-[var(--muted-foreground)]" />
                  Content Types
                </Label>
                <div className="mt-1.5 border border-[var(--border)] rounded-md p-3 bg-[var(--card-bg)] max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                  {dummyContentTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-[var(--card-bg-inner)] transition-colors group"
                    >
                      <Checkbox
                        checked={contentTypeIds.includes(type.id)}
                        onCheckedChange={() => handleToggleContentType(type.id)}
                        className="shrink-0"
                      />
                      <span className="text-sm text-[var(--foreground)] font-medium">
                        {type.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                  <Filter className="w-4 h-4 inline mr-1.5 text-[var(--muted-foreground)]" />
                  Status
                </Label>
                <Select
                  value={status || "all"}
                  onValueChange={(v) => setStatus(v === "all" ? "" : (v as WorkflowStatus))}
                >
                  <SelectTrigger
                    id="status"
                    className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors"
                  >
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="ready_for_approval">Ready for Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Metadata Filters Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">
                Metadata Filters
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range */}
              <div>
                <Label htmlFor="fromDate" className="text-sm font-medium text-[var(--foreground)]">
                  From Date
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="toDate" className="text-sm font-medium text-[var(--foreground)]">
                  To Date
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            {/* Tags and Created By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags" className="text-sm font-medium text-[var(--foreground)]">
                  <Tag className="w-4 h-4 inline mr-1.5 text-[var(--muted-foreground)]" />
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, tutorial, javascript"
                  className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
                  Separate multiple tags with commas
                </p>
              </div>
              <div>
                <Label htmlFor="createdBy" className="text-sm font-medium text-[var(--foreground)]">
                  <User className="w-4 h-4 inline mr-1.5 text-[var(--muted-foreground)]" />
                  Created By
                </Label>
                <Select
                  value={createdBy?.toString() || "all"}
                  onValueChange={(v) => setCreatedBy(v === "all" ? undefined : parseInt(v))}
                >
                  <SelectTrigger
                    id="createdBy"
                    className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors"
                  >
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {dummyUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Sort Options Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="w-4 h-4 text-[var(--muted-foreground)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">
                Sort Options
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sortBy" className="text-sm font-medium text-[var(--foreground)]">
                  Sort By
                </Label>
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as typeof sortBy)}
                >
                  <SelectTrigger
                    id="sortBy"
                    className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="updated_at">Updated Date</SelectItem>
                    <SelectItem value="published_at">Published Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="orderBy" className="text-sm font-medium text-[var(--foreground)]">
                  Order
                </Label>
                <Select
                  value={orderBy}
                  onValueChange={(v) => setOrderBy(v as typeof orderBy)}
                >
                  <SelectTrigger
                    id="orderBy"
                    className="mt-1.5 border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] transition-colors"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
}
