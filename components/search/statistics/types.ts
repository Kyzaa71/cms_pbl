// Types for Search Statistics feature

export interface SearchStats {
  total_searches: number;
  unique_queries: number;
  avg_results_per_search: number;
  popular_queries: string[];
  zero_result_queries: string[];
  searches_by_content_type?: Record<string, number>;
  searches_by_date?: Array<{
    date: string;
    count: number;
  }>;
}

export interface PopularQuery {
  term: string;
  count: number;
  trend?: "up" | "down" | "stable";
}

