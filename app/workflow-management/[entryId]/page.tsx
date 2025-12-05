"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EntryDetailView } from "@/components/workflow-management/entry-detail-view";
import { contentService } from "@/lib/services/content-service";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;

  const [entry, setEntry] = useState<any>(null);
  useEffect(() => {
    if (entryId) contentService.getEntry(entryId).then(setEntry);
  }, [entryId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/workflow-management")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Entry Details
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              View workflow details and manage status transitions
            </p>
          </div>
        </div>
      </div>

      {/* Detail View */}
      <EntryDetailView entry={entry || null} />
    </div>
  );
}

