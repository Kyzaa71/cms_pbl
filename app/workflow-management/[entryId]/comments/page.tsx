"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WorkflowCommentsPanel } from "@/components/workflow-management/workflow-comments-panel";
import {
  dummyEntries,
  getCommentsByEntryId,
} from "@/components/workflow-management/types";

export default function WorkflowCommentsPage() {
  const params = useParams();
  const router = useRouter();
  const [includePrivate, setIncludePrivate] = useState(false);
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;

  const entry = entryId ? dummyEntries.find((e) => e.id === entryId) : null;
  const comments = entryId ? getCommentsByEntryId(entryId) : [];

  const handleAddComment = (comment: string, isPrivate: boolean) => {
    console.log("Add comment:", entryId, comment, isPrivate);
    // In real app, this would call API
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
              {entry
                ? `Comments and feedback for "${entry.title}"`
                : "Workflow comments"}
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

