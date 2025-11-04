"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { SearchStats } from "@/components/search/statistics/types";
import { generateSearchStats } from "@/components/search/statistics/statistics-helpers";
import { StatisticsOverview } from "@/components/search/statistics/statistics-overview";
import { PopularTermsList } from "@/components/search/statistics/popular-terms-list";
import { ContentTypeStats } from "@/components/search/statistics/content-type-stats";

export default function SearchStatisticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setIsLoading(true);
    // In a real app, this would fetch from: GET /search/stats
    setTimeout(() => {
      const data = generateSearchStats();
      setStats(data);
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto mb-3" />
          <p className="text-sm text-[var(--muted-foreground)]">
            Loading search statistics...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-[var(--foreground)] mb-2">
          Failed to load statistics
        </p>
        <Button onClick={loadStatistics} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/search">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Search Statistics
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Analytics and insights from search activity
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={loadStatistics}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <StatisticsOverview stats={stats} />

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularTermsList stats={stats} />
        <ContentTypeStats stats={stats} />
      </div>

      {/* Zero Result Queries */}
      {stats.zero_result_queries && stats.zero_result_queries.length > 0 && (
        <Card className="p-6 border border-[var(--border)] bg-[var(--card-bg-inner)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-500/10 rounded">
              <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Queries with No Results
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Consider creating content for these search terms
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.zero_result_queries.map((query) => (
              <Badge
                key={query}
                variant="outline"
                className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
              >
                {query}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

