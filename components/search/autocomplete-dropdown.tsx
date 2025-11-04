"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { AutocompleteSuggestion } from "./types";

interface AutocompleteDropdownProps {
  suggestions: AutocompleteSuggestion[];
  isOpen: boolean;
  selectedIndex: number;
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  onClose: () => void;
  query: string;
}

export function AutocompleteDropdown({
  suggestions,
  isOpen,
  selectedIndex,
  onSelect,
  onClose,
  query,
}: AutocompleteDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  const highlightMatch = (text: string, query: string): string => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-900/50 font-semibold px-0.5 rounded'>$1</mark>");
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 z-50"
    >
      <Card className="border border-[var(--border)] bg-[var(--card-bg)] shadow-xl rounded-lg overflow-hidden max-h-72 overflow-y-auto custom-scrollbar">
        <div className="py-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.text}-${index}`}
              onClick={() => onSelect(suggestion)}
              className={`
                w-full px-4 py-3 text-left transition-colors
                ${index === selectedIndex
                  ? "bg-[var(--primary)]/10 text-[var(--foreground)] border-l-2 border-[var(--primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--card-bg-inner)]"
                }
              `}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium text-[var(--foreground)]"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(suggestion.text, query),
                    }}
                  />
                  {suggestion.contentTypeName && (
                    <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]"></span>
                      {suggestion.contentTypeName}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

