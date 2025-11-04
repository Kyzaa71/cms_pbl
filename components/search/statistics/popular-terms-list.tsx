"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchStats } from "./types";
import { TrendingUp, Search } from "lucide-react";

interface PopularTermsListProps {
  stats: SearchStats;
}

export function PopularTermsList({ stats }: PopularTermsListProps) {
  // Convert popular_queries to objects with mock counts
  const popularTerms = stats.popular_queries.map((term, index) => ({
    term,
    count: Math.floor(Math.random() * 100) + 20, // Mock count
    rank: index + 1,
  }));

  return (
    <Card className="p-6 border border-[var(--border)] bg-[var(--card-bg-inner)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-500/10 rounded">
          <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Popular Search Terms
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Most frequently searched queries
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {popularTerms.length > 0 ? (
          popularTerms.map((item, index) => (
            <div
              key={item.term}
              className="flex items-center justify-between p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--primary)]">
                    #{item.rank}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <span className="font-medium text-[var(--foreground)]">
                    {item.term}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.count} searches
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            No popular terms available
          </div>
        )}
      </div>
    </Card>
  );
}

