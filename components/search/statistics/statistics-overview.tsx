"use client";

import { Card } from "@/components/ui/card";
import { SearchStats } from "./types";
import { formatNumber } from "./statistics-helpers";
import { Search, Hash, BarChart3, TrendingUp } from "lucide-react";

interface StatisticsOverviewProps {
  stats: SearchStats;
}

export function StatisticsOverview({ stats }: StatisticsOverviewProps) {
  const overviewCards = [
    {
      title: "Total Searches",
      value: formatNumber(stats.total_searches),
      icon: Search,
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Unique Queries",
      value: formatNumber(stats.unique_queries),
      icon: Hash,
      color: "bg-green-500/10 text-green-700 dark:text-green-400",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Avg Results",
      value: stats.avg_results_per_search.toFixed(1),
      icon: BarChart3,
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Popular Terms",
      value: formatNumber(stats.popular_queries.length),
      icon: TrendingUp,
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className="p-6 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[var(--muted-foreground)] mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-semibold text-[var(--foreground)]">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

