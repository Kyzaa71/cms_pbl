"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Search, FileText } from "lucide-react";
import { searchService } from "@/lib/services/search-service";
import type { ContentEntry } from "@/types/backend-models";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { useContentTypes } from "@/hooks/use-content";

interface EntrySelectorProps {
  value?: number;
  onChange: (entryId: number) => void;
  excludeEntryId?: number;
  placeholder?: string;
  label?: string;
}

export function EntrySelector({
  value,
  onChange,
  excludeEntryId,
  placeholder = "Search for content entry...",
  label = "Select Entry",
}: EntrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ContentEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: contentTypes } = useContentTypes();
  const ctNameById = useMemo(() => {
    const m: Record<number, string> = {};
    for (const ct of contentTypes || []) m[ct.id] = ct.name;
    return m;
  }, [contentTypes]);

  const titleOf = (e: ContentEntry) => {
    const d = (e.data || {}) as Record<string, unknown>;
    const keys = ["title", "name", "headline", "meta_title"];
    for (const k of keys) {
      const v = d[k];
      if (typeof v === "string" && v.trim().length > 0) return v as string;
    }
    // pick first string field
    for (const [k, v] of Object.entries(d)) {
      if (typeof v === "string" && v.trim().length > 0) return v as string;
    }
    return `Entry #${e.id}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Search entries from backend
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!isOpen) return;
      try {
        const q = searchQuery.trim() || "";
        let { entries } = await searchService.fullText({ q, limit: 10, page: 1 });
        if (entries.length === 0 && q.length > 0) {
          const fallback = await searchService.fullText({ q: "", limit: 10, page: 1 });
          entries = fallback.entries;
        }
        if (!active) return;
        const qq = q.toLowerCase();
        const filtered = entries.filter((e) => {
          if (excludeEntryId && e.id === excludeEntryId) return false;
          if (!qq) return true;
          const title = titleOf(e).toLowerCase();
          const ctName = (ctNameById[e.content_type_id] || `content type #${e.content_type_id}`).toLowerCase();
          const statusLabel = String((e.status || "")).replace(/_/g, " ").toLowerCase();
          return (
            title.includes(qq) ||
            ctName.includes(qq) ||
            statusLabel.includes(qq)
          );
        });
        setResults(filtered);
      } catch {
        if (!active) return;
        setResults([]);
      }
    };
    const t = setTimeout(run, 200);
    return () => { active = false; clearTimeout(t); };
  }, [searchQuery, isOpen, excludeEntryId]);

  const selectedEntry = value ? results.find((e) => e.id === value) : null;

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <Label>{label}</Label>
      
      {/* Selected Entry Display */}
      {selectedEntry && (
        <Card className="p-3 bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--foreground)]">
                  {titleOf(selectedEntry)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {ctNameById[selectedEntry.content_type_id] || `Content Type #${selectedEntry.content_type_id}`}
                </span>
                <StatusBadge status={selectedEntry.status as any} />
              </div>
            </div>
            <button
              onClick={() => onChange(0)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] ml-2"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {/* Search Input */}
      {(!selectedEntry || isOpen) && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
          />
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto custom-scrollbar border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-lg">
          <div className="p-2 space-y-1">
            {results.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  onChange(entry.id);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className="w-full text-left p-2 rounded-md hover:bg-[var(--card-bg)] transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {titleOf(entry)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {ctNameById[entry.content_type_id] || `Content Type #${entry.content_type_id}`}
                    </span>
                    <StatusBadge status={entry.status as any} />
                  </div>
                </div>
                <FileText className="h-4 w-4 text-[var(--muted-foreground)] ml-2" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {isOpen && results.length === 0 && searchQuery && (
        <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
          No entries found
        </p>
      )}

      {selectedEntry && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Change selection
        </button>
      )}
    </div>
  );
}
