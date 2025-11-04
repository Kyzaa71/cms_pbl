"use client";

import { Card } from "@/components/ui/card";
import { FileCode } from "lucide-react";
import { APIReference } from "./types";

interface APIReferenceFooterProps {
  apiRef: APIReference;
}

export function APIReferenceFooter({ apiRef }: APIReferenceFooterProps) {
  return (
    <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex items-start gap-3">
        <FileCode className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            API Documentation
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            All API requests require authentication via Bearer token. Ensure you have the
            appropriate permissions ({apiRef.endpoints[0]?.permission || "ContentEntry:read"}) to
            access these endpoints.
          </p>
        </div>
      </div>
    </Card>
  );
}

