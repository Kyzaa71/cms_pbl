"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, FileText, Calendar, User, History, MessageSquare } from "lucide-react";
import { getInitials, formatDateTime } from "@/components/approval-queue/types";
import { getEntriesByStatus } from "@/components/workflow-management/types";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { ApprovalActions } from "@/components/approval-queue/approval-actions";
import { getHistoryByEntryId, getCommentsByEntryId } from "@/components/workflow-management/types";
import Link from "next/link";
import { workflowService } from "@/lib/services/workflow-service";

export default function ApprovalQueueEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;

  const entries = getEntriesByStatus();
  const entry = entryId ? entries.find((e) => e.id === entryId) : null;

  const history = entryId ? getHistoryByEntryId(entryId) : [];
  const comments = entryId ? getCommentsByEntryId(entryId) : [];

  const handleApprove = (entryId: number, comment?: string) => {
    console.log("Approve entry:", entryId, comment);
    // In real app, this would call API: POST /workflow/entries/:entry_id/approve
    alert(`Entry ${entryId} approved${comment ? ` with comment: ${comment}` : ""}`);
    // Redirect back to approval queue
    router.push("/approval-queue");
  };

  const handleReject = (entryId: number, comment: string) => {
    console.log("Reject entry:", entryId, comment);
    // In real app, this would call API: POST /workflow/entries/:entry_id/reject
    alert(`Entry ${entryId} rejected with reason: ${comment}`);
    // Redirect back to approval queue
    router.push("/approval-queue");
  };

  const handlePublish = async (entryId: number, comment?: string) => {
    try {
      await workflowService.publish(entryId, { comment });
      alert(`Entry ${entryId} published${comment ? ` with comment: ${comment}` : ""}`);
      router.push("/approval-queue");
    } catch (e: any) {
      alert(String(e?.message || "Failed to publish entry"));
    }
  };

  if (!entry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/approval-queue")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Entry Not Found
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              This entry is not in the approval queue or does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/approval-queue")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Approval Review
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Review entry before approving or rejecting
            </p>
          </div>
        </div>
        <Link href={`/workflow-management/${entry.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            View in Workflow
          </Button>
        </Link>
      </div>

      {/* Main Info Card */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {entry.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {entry.contentType.name}
              </span>
              <StatusBadge status={entry.status} />
            </div>
          </div>
        </div>

        {/* Approval Actions */}
        <div className="mb-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
                Approval Actions
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Approve or reject this entry. Rejection requires a reason.
              </p>
            </div>
            <ApprovalActions
              entryId={entry.id}
              entryTitle={entry.title}
              onApprove={handleApprove}
              onReject={handleReject}
              status={entry.status}
              onPublish={handlePublish}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Creator
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-xs">
                  {getInitials(entry.creator.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  {entry.creator.name}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {entry.creator.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Dates
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">Created: </span>
                <span className="text-sm text-[var(--foreground)]">
                  {formatDateTime(entry.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">Last Updated: </span>
                <span className="text-sm text-[var(--foreground)]">
                  {formatDateTime(entry.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">History</p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                {history.length}
              </p>
            </div>
            <History className="w-8 h-8 text-[var(--primary)] opacity-60" />
          </div>
          <Link href={`/workflow-management/${entry.id}/history`}>
            <Button variant="link" className="p-0 h-auto mt-2 text-[var(--primary)]">
              View Timeline →
            </Button>
          </Link>
        </Card>

        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Comments</p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                {comments.length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-[var(--primary)] opacity-60" />
          </div>
          <Link href={`/workflow-management/${entry.id}/comments`}>
            <Button variant="link" className="p-0 h-auto mt-2 text-[var(--primary)]">
              View Comments →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

