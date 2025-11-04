"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Globe } from "lucide-react";
import { APIReference } from "./types";

interface APIInfoCardProps {
  apiRef: APIReference;
}

export function APIInfoCard({ apiRef }: APIInfoCardProps) {
  return (
    <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[var(--secondary)]/10 rounded">
              <Code className="w-6 h-6 text-[var(--secondary)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {apiRef.content_type} API
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                {apiRef.description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Base URL</p>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--primary)]" />
                <code className="text-sm text-[var(--foreground)] font-mono">
                  {apiRef.base_url}
                </code>
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Content Type ID</p>
              <code className="text-sm text-[var(--foreground)] font-mono">
                {apiRef.content_type_id}
              </code>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Slug</p>
              <code className="text-sm text-[var(--foreground)] font-mono">
                {apiRef.slug}
              </code>
            </div>
          </div>
          {apiRef.seo_enabled && (
            <div className="mt-4">
              <Badge className="bg-[var(--success)] text-white">
                SEO Enabled
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

