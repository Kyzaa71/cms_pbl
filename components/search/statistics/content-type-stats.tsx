"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchStats } from "./types";
import { formatNumber } from "./statistics-helpers";
import { FileText, TrendingUp } from "lucide-react";

interface ContentTypeStatsProps {
  stats: SearchStats;
}

export function ContentTypeStats({ stats }: ContentTypeStatsProps) {
  if (!stats.searches_by_content_type) {
    return null;
  }

  const contentTypeEntries = Object.entries(stats.searches_by_content_type)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const totalSearches = contentTypeEntries.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6 border border-[var(--border)] bg-[var(--card-bg-inner)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-500/10 rounded">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Searches by Content Type
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Distribution of searches across content types
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {contentTypeEntries.map((item) => {
          const percentage = totalSearches > 0 ? (item.count / totalSearches) * 100 : 0;
          
          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {formatNumber(item.count)}
                  </Badge>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-[var(--card-bg)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {contentTypeEntries.length === 0 && (
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          No content type data available
        </div>
      )}
    </Card>
  );
}

