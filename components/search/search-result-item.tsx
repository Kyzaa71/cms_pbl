"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, ArrowRight } from "lucide-react";
import {
  type ContentEntry,
  formatDate,
  getStatusBadgeColor,
  highlightText,
} from "./types";

interface SearchResultItemProps {
  entry: ContentEntry;
  searchQuery: string;
  onClick: () => void;
}

export function SearchResultItem({
  entry,
  searchQuery,
  onClick,
}: SearchResultItemProps) {
  return (
    <Card
      className="p-5 border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-[var(--card-bg-inner)]"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className={`${getStatusBadgeColor(entry.status)} text-xs font-medium`}>
              {entry.status.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium border-[var(--border)]">
              {entry.contentType.name}
            </Badge>
            {entry.tags?.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs font-medium border-purple-200 text-purple-700 dark:text-purple-300 dark:border-purple-800"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
            {entry.title}
          </h3>
          {entry.description && (
            <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
              {entry.description}
            </p>
          )}
          {entry.excerpt && (
            <p
              className="text-sm text-[var(--foreground)] mb-3 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: highlightText(entry.excerpt, searchQuery),
              }}
            />
          )}
          <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] flex-wrap">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">{entry.creator.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
            {entry.publishedAt && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Published {formatDate(entry.publishedAt)}</span>
              </div>
            )}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
      </div>
    </Card>
  );
}

