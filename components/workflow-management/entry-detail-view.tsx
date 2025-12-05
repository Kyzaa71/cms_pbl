"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  User,
  FileText,
  History,
  MessageSquare,
  UserPlus,
  
} from "lucide-react";
import { formatDateTime, getInitials, WorkflowStatus } from "./types";
import { StatusBadge } from "./status-badge";
import { WorkflowActions } from "./workflow-actions";
import { StatusTransitionModal } from "./status-transition-modal";
import type { ContentEntry, WorkflowHistory, WorkflowComment } from "@/types/backend-models";
import { workflowService } from "@/lib/services/workflow-service";
import { useAuth } from "@/hooks/use-auth";
import { contentService } from "@/lib/services/content-service";

interface EntryDetailViewProps {
  entry: ContentEntry | null;
}

export function EntryDetailView({ entry }: EntryDetailViewProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedToStatus, setSelectedToStatus] = useState<WorkflowStatus | null>(null);
  const [history, setHistory] = useState<WorkflowHistory[]>([]);
  const [comments, setComments] = useState<WorkflowComment[]>([]);
  const [contentTypeName, setContentTypeName] = useState<string>("");
  const [viewEntry, setViewEntry] = useState<ContentEntry | null>(entry);
  const { user } = useAuth();
  useEffect(() => { setViewEntry(entry); }, [entry]);
  useEffect(() => {
    if (viewEntry?.id) {
      workflowService.history(viewEntry.id).then(setHistory).catch(() => setHistory([]));
      workflowService.comments(viewEntry.id).then(setComments).catch(() => setComments([]));
    }
  }, [viewEntry?.id]);

  useEffect(() => {
    if (viewEntry?.content_type_id) {
      contentService
        .getContentType(viewEntry.content_type_id)
        .then((ct) => setContentTypeName(ct.name))
        .catch(() => setContentTypeName(""));
    } else {
      setContentTypeName("");
    }
  }, [viewEntry?.content_type_id]);

  if (!viewEntry) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        Entry not found
      </div>
    );
  }

  const handleStatusChange = (toStatus: WorkflowStatus) => {
    setSelectedToStatus(toStatus);
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (comment: string) => {
    if (!viewEntry || !selectedToStatus) return;
    let updated: ContentEntry | null = null;
    if (selectedToStatus === "in_review") {
      updated = await workflowService.requestReview(viewEntry.id, { comment }).catch(() => null);
    } else if (selectedToStatus === "approved") {
      updated = await workflowService.approve(viewEntry.id, { comment }).catch(() => null);
  } else if (selectedToStatus === "published") {
    updated = await workflowService.publish(viewEntry.id, { comment }).catch(() => null);
  } else if (selectedToStatus === "rejected") {
    const roleName = ((user?.role?.name || "") as string).toLowerCase().trim() || "viewer";
    const from = (viewEntry?.status || "draft") as WorkflowStatus;
    if (roleName === "editor" && from === "in_review") {
      updated = await workflowService.changeStatus(viewEntry.id, { status: "rejected", comment }).catch(() => null);
    } else {
      updated = await workflowService.reject(viewEntry.id, { comment }).catch(() => null);
    }
  } else {
    updated = await workflowService.changeStatus(viewEntry.id, { status: selectedToStatus, comment }).catch(() => null);
  }
    if (updated) {
      setViewEntry(updated);
      workflowService.history(updated.id).then(setHistory).catch(() => setHistory([]));
      workflowService.comments(updated.id).then(setComments).catch(() => setComments([]));
      if (updated.content_type_id) {
        contentService.getContentType(updated.content_type_id).then((ct) => setContentTypeName(ct.name)).catch(() => setContentTypeName(""));
      }
    }
    setShowStatusModal(false);
    setSelectedToStatus(null);
  };

  const requireComment = (() => {
    const roleName = ((user?.role?.name || "") as string).toLowerCase().trim() || "viewer";
    const from = (viewEntry?.status || "draft") as WorkflowStatus;
    const to = (selectedToStatus || "draft") as WorkflowStatus;
    return from === "in_review" && to === "rejected" && roleName === "editor";
  })();

  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {(() => {
              const d = (typeof viewEntry.data === "object" && viewEntry.data) ? (viewEntry.data as Record<string, unknown>) : null;
              const t = d ? d["title"] : undefined;
              const n = d ? d["name"] : undefined;
              const displayTitle = typeof t === "string" ? t : typeof n === "string" ? n : `Entry #${viewEntry.id}`;
              return (
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">{displayTitle}</h2>
              );
            })()}
            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {contentTypeName || "Unknown Content Type"}
              </span>
              <StatusBadge status={viewEntry.status} />
            </div>
          </div>
        </div>

        {/* Workflow Actions */}
        <div className="mb-6 pb-6 border-b border-[var(--border)] bg-[var(--card-bg)] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">
            Workflow Actions
          </h3>
          <WorkflowActions
            currentStatus={viewEntry.status}
            onStatusChange={handleStatusChange}
            entryId={viewEntry.id}
          />
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
                  {getInitials(viewEntry.creator?.name || "Unknown")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  {viewEntry.creator?.name || "Unknown"}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {viewEntry.creator?.email || ""}
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
                  {formatDateTime(viewEntry.created_at)}
                </span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">Updated: </span>
                <span className="text-sm text-[var(--foreground)]">
                  {formatDateTime(viewEntry.updated_at)}
                </span>
              </div>
              {viewEntry.published_at && (
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">Published: </span>
                  <span className="text-sm text-[var(--foreground)]">
                    {formatDateTime(viewEntry.published_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Link href={`/workflow-management/${viewEntry.id}/history`}>
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
          <Link href={`/workflow-management/${viewEntry.id}/comments`}>
            <Button variant="link" className="p-0 h-auto mt-2 text-[var(--primary)]">
              View Comments →
            </Button>
          </Link>
        </Card>

        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Assignments</p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">-</p>
            </div>
            <UserPlus className="w-8 h-8 text-[var(--primary)] opacity-60" />
          </div>
          <Button
            variant="link"
            className="p-0 h-auto mt-2 text-[var(--primary)]"
            onClick={() => {
              console.log("Assign entry:", viewEntry.id);
            }}
          >
            Assign Entry →
          </Button>
        </Card>
      </div>

      {/* Status Transition Modal */}
      {showStatusModal && selectedToStatus && (
        <StatusTransitionModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedToStatus(null);
          }}
          fromStatus={viewEntry.status}
          toStatus={selectedToStatus}
          onSubmit={handleStatusSubmit}
          requireComment={requireComment}
        />
      )}
    </div>
  );
}

