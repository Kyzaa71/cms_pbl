// Helper functions for Search Statistics

import { SearchStats, PopularQuery } from "./types";
import { dummyEntries } from "../types";

/**
 * Generate mock search statistics
 * In a real app, this would fetch from: GET /search/stats
 */
export function generateSearchStats(): SearchStats {
  // Mock data based on search patterns
  const popularQueries = [
    "react tutorial",
    "getting started",
    "node.js",
    "typescript",
    "product",
    "blog post",
    "tutorial",
    "api documentation",
  ];

  const contentTypeCounts: Record<string, number> = {};
  dummyEntries.forEach((entry) => {
    const typeName = entry.contentType.name;
    contentTypeCounts[typeName] = (contentTypeCounts[typeName] || 0) + 10; // Mock: 10 searches per entry
  });

  // Generate mock date data (last 30 days)
  const searchesByDate: Array<{ date: string; count: number }> = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    searchesByDate.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50) + 10, // Random between 10-60
    });
  }

  return {
    total_searches: 1234,
    unique_queries: 456,
    avg_results_per_search: 8.5,
    popular_queries: popularQueries,
    zero_result_queries: ["xyz123", "nonexistent", "test query"],
    searches_by_content_type: contentTypeCounts,
    searches_by_date: searchesByDate,
  };
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format date for display
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Get trend icon
 */
export function getTrendIcon(trend?: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up":
      return "📈";
    case "down":
      return "📉";
    default:
      return "➡️";
  }
}

