"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Clock,
} from "lucide-react";
import {
  ContentEntry,
  formatDate,
  formatDateTime,
  getInitials,
  getHistoryByEntryId,
  getCommentsByEntryId,
} from "./types";
import { StatusBadge } from "./status-badge";
import { WorkflowActions } from "./workflow-actions";
import { StatusTransitionModal } from "./status-transition-modal";
import { WorkflowStatus } from "./types";

interface EntryDetailViewProps {
  entry: ContentEntry | null;
}

export function EntryDetailView({ entry }: EntryDetailViewProps) {
  const router = useRouter();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedToStatus, setSelectedToStatus] = useState<WorkflowStatus | null>(null);

  if (!entry) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        Entry not found
      </div>
    );
  }

  const history = getHistoryByEntryId(entry.id);
  const comments = getCommentsByEntryId(entry.id);

  const handleStatusChange = (toStatus: WorkflowStatus) => {
    setSelectedToStatus(toStatus);
    setShowStatusModal(true);
  };

  const handleStatusSubmit = (comment: string) => {
    console.log("Change status:", entry.id, selectedToStatus, comment);
    // In real app, this would call API
    // For now, just close modal
    setShowStatusModal(false);
    setSelectedToStatus(null);
  };

  const requireComment = selectedToStatus === "rejected";

  return (
    <div className="space-y-6">
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

        {/* Workflow Actions */}
        <div className="mb-6 pb-6 border-b border-[var(--border)] bg-[var(--card-bg)] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">
            Workflow Actions
          </h3>
          <WorkflowActions
            currentStatus={entry.status}
            onStatusChange={handleStatusChange}
            entryId={entry.id}
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
                <span className="text-xs text-[var(--muted-foreground)]">Updated: </span>
                <span className="text-sm text-[var(--foreground)]">
                  {formatDateTime(entry.updatedAt)}
                </span>
              </div>
              {entry.publishedAt && (
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">Published: </span>
                  <span className="text-sm text-[var(--foreground)]">
                    {formatDateTime(entry.publishedAt)}
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
              // Open assign modal or navigate
              console.log("Assign entry:", entry.id);
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
          fromStatus={entry.status}
          toStatus={selectedToStatus}
          onSubmit={handleStatusSubmit}
          requireComment={requireComment}
        />
      )}
    </div>
  );
}

