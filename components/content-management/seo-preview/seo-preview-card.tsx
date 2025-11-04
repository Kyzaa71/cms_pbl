"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle, Search } from "lucide-react";
import { GooglePreviewProps } from "./types";
import { truncateText, formatURL } from "./seo-preview-helpers";

interface SEOPreviewCardProps {
  data: GooglePreviewProps;
  url?: string;
}

export function SEOPreviewCard({ data, url }: SEOPreviewCardProps) {
  const displayUrl = url || formatURL();
  const displayTitle = data.title || "Page Title";
  const displayDescription = truncateText(data.description, 160);

  return (
    <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Google Search Preview
        </h3>
      </div>

      <div className="space-y-3">
        {/* Google Search Result Preview */}
        <div className="border-l-4 border-l-[var(--primary)] pl-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xs text-[var(--muted-foreground)]">
              {displayUrl}
            </div>
            <div className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
            <div className="text-xs text-[var(--muted-foreground)]">
              More results
            </div>
          </div>
          
          <div>
            <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-normal leading-6 mb-1">
              {displayTitle}
            </h4>
          </div>
          
          <p className="text-sm text-[#4e5156] leading-5">
            {displayDescription || (
              <span className="italic text-[var(--muted-foreground)]">
                No description provided
              </span>
            )}
          </p>
        </div>

        {/* Character Count Info */}
        <div className="pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[var(--muted-foreground)]">Title: </span>
            <span className={data.title && data.title.length > 60 ? "text-[var(--danger)]" : "text-[var(--foreground)]"}>
              {data.title?.length || 0} / 60 characters
            </span>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Description: </span>
            <span className={data.description && data.description.length > 160 ? "text-[var(--danger)]" : "text-[var(--foreground)]"}>
              {data.description?.length || 0} / 160 characters
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

