"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WorkflowHistoryTimeline } from "@/components/workflow-management/workflow-history-timeline";
import {
  dummyEntries,
  getHistoryByEntryId,
  dummyHistory,
} from "@/components/workflow-management/types";

export default function WorkflowHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;

  const entry = entryId ? dummyEntries.find((e) => e.id === entryId) : null;
  const history = entryId ? getHistoryByEntryId(entryId) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/workflow-management/${entryId}`)}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Workflow History
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              {entry
                ? `View complete workflow history for "${entry.title}"`
                : "View workflow history"}
            </p>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <WorkflowHistoryTimeline history={history} />
    </div>
  );
}

