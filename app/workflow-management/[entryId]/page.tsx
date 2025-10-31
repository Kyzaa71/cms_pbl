"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EntryDetailView } from "@/components/workflow-management/entry-detail-view";
import { dummyEntries } from "@/components/workflow-management/types";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;

  const entry = entryId ? dummyEntries.find((e) => e.id === entryId) : null;

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

