"use client";

import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { type SearchResult } from "./types";

interface SearchStatsProps {
  searchResult: SearchResult | null;
}

export function SearchStats({ searchResult }: SearchStatsProps) {
  if (!searchResult) return null;

  return (
    <Card className="p-5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)] border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">Search Results</p>
          <p className="text-2xl font-bold">{searchResult.total}</p>
          <p className="text-xs opacity-80 mt-1">
            Page {searchResult.page} of {searchResult.total_pages}
          </p>
        </div>
        <Search className="w-8 h-8 opacity-80" />
      </div>
    </Card>
  );
}

