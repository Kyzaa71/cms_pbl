"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Search, FileText } from "lucide-react";
import { dummyEntries } from "@/components/workflow-management/types";
import { StatusBadge } from "@/components/workflow-management/status-badge";

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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Filter entries
  const availableEntries = dummyEntries.filter((entry) => {
    if (excludeEntryId && entry.id === excludeEntryId) return false;
    if (!searchQuery) return true;
    return (
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.contentType.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).slice(0, 10); // Limit to 10 results for better UX

  const selectedEntry = value ? dummyEntries.find((e) => e.id === value) : null;

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
                  {selectedEntry.title}
                </span>
                <StatusBadge status={selectedEntry.status} />
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                {selectedEntry.contentType.name}
              </p>
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
      {isOpen && availableEntries.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto custom-scrollbar border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-lg">
          <div className="p-2 space-y-1">
            {availableEntries.map((entry) => (
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
                      {entry.title}
                    </span>
                    <StatusBadge status={entry.status} />
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {entry.contentType.name}
                  </p>
                </div>
                <FileText className="h-4 w-4 text-[var(--muted-foreground)] ml-2" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {isOpen && availableEntries.length === 0 && searchQuery && (
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

