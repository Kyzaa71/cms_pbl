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
    <Card className="p-5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)] border-0 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1 font-medium">Search Results</p>
          <p className="text-3xl font-bold">{searchResult.total.toLocaleString('en-US')}</p>
          <p className="text-xs opacity-80 mt-2">
            Page {searchResult.page} of {searchResult.total_pages}
          </p>
        </div>
        <Search className="w-10 h-10 opacity-80" />
      </div>
    </Card>
  );
}

