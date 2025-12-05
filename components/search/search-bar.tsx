"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { dummyContentTypes, type WorkflowStatus, AutocompleteSuggestion } from "./types";
import { debounce } from "./autocomplete-helpers";
import { searchService } from "@/lib/services/search-service";
import { AutocompleteDropdown } from "./autocomplete-dropdown";

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
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate suggestions with debounce
  const generateSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length >= 2) {
        try {
          const contentTypeId = contentTypeFilter.length === 1 ? contentTypeFilter[0] : 0;
          const results = await searchService.autocomplete({ field: "title", prefix: query, content_type_id: contentTypeId, limit: 8 });
          const suggestions: AutocompleteSuggestion[] = (results || []).map((text) => ({ text, type: "title" }));
          setSuggestions(suggestions);
          setIsAutocompleteOpen(suggestions.length > 0);
          setSelectedIndex(-1);
        } catch {
          setSuggestions([]);
          setIsAutocompleteOpen(false);
          setSelectedIndex(-1);
        }
      } else {
        setSuggestions([]);
        setIsAutocompleteOpen(false);
        setSelectedIndex(-1);
      }
    }, 300),
    [contentTypeFilter]
  );

  useEffect(() => {
    generateSuggestions(searchQuery);
  }, [searchQuery, generateSuggestions]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isAutocompleteOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsAutocompleteOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    onSearchChange(suggestion.text);
    setIsAutocompleteOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (value: string) => {
    onSearchChange(value);
    setIsAutocompleteOpen(value.length >= 2);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && searchQuery.length >= 2) {
      setIsAutocompleteOpen(true);
    }
  };

  return (
    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] z-10" />
        <Input
          ref={inputRef}
          placeholder="Search by title, description, or content..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="pl-10 pr-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange("");
              setIsAutocompleteOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-full p-0.5 hover:bg-[var(--card-bg)] z-10"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Autocomplete Dropdown */}
        <AutocompleteDropdown
          suggestions={suggestions}
          isOpen={isAutocompleteOpen}
          selectedIndex={selectedIndex}
          onSelect={handleSelectSuggestion}
          onClose={() => setIsAutocompleteOpen(false)}
          query={searchQuery}
        />
      </div>

      {/* Quick Filters Row */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)] mr-1">Active filters:</span>
          {statusFilter && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--secondary)]/10 text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)]/20 transition-colors text-xs font-medium"
            >
              Status: {statusFilter.replace(/_/g, " ")}
              <button
                onClick={onClearStatus}
                className="ml-0.5 hover:bg-[var(--secondary)]/20 rounded-full p-0.5 transition-colors"
                aria-label="Remove status filter"
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
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--primary)]/20 transition-colors text-xs font-medium"
              >
                {type?.name}
                <button
                  onClick={() => onToggleContentType(typeId)}
                  className="ml-0.5 hover:bg-[var(--primary)]/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${type?.name} filter`}
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
              className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 transition-colors text-xs font-medium"
            >
              {tag}
              <button
                onClick={() => onToggleTag(tag)}
                className="ml-0.5 hover:bg-teal-500/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag} tag filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] font-medium ml-1"
          >
            Clear all
          </Button>
        </div>
      )}
    </Card>
  );
}

