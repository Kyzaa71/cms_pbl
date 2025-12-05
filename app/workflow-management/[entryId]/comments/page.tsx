"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WorkflowCommentsPanel } from "@/components/workflow-management/workflow-comments-panel";
import { contentService } from "@/lib/services/content-service";
import { workflowService } from "@/lib/services/workflow-service";
import type { ContentEntry, WorkflowComment } from "@/types/backend-models";

export default function WorkflowCommentsPage() {
  const params = useParams();
  const router = useRouter();
  const [includePrivate, setIncludePrivate] = useState(false);
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;
  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [comments, setComments] = useState<WorkflowComment[]>([]);

  useEffect(() => {
    if (entryId) {
      contentService.getEntry(entryId).then(setEntry).catch(() => setEntry(null));
    }
  }, [entryId]);

  useEffect(() => {
    if (entryId) {
      workflowService
        .comments(entryId, includePrivate)
        .then(setComments)
        .catch(() => setComments([]));
    }
  }, [entryId, includePrivate]);

  const handleAddComment = async (comment: string, isPrivate: boolean) => {
    if (!entryId) return;
    await workflowService.addComment(entryId, { comment, is_private: isPrivate });
    const latest = await workflowService.comments(entryId, includePrivate);
    setComments(latest);
  };

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
              Workflow Comments
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              {(() => {
                if (!entry) return "Workflow comments";
                const d = (typeof entry.data === "object" && entry.data) ? (entry.data as Record<string, unknown>) : null;
                const t = d ? d["title"] : undefined;
                const n = d ? d["name"] : undefined;
                const displayTitle = typeof t === "string" ? t : typeof n === "string" ? n : `Entry #${entryId}`;
                return `Comments and feedback for "${displayTitle}"`;
              })()}
            </p>
        </div>
      </div>
      </div>

      {/* Comments Panel */}
      <WorkflowCommentsPanel
        comments={comments}
        onAddComment={handleAddComment}
        includePrivate={includePrivate}
        onTogglePrivate={() => setIncludePrivate(!includePrivate)}
      />
    </div>
  );
}

