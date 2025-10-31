"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowStatus, getStatusLabel, getStatusColor } from "./types";
import { StatusBadge } from "./status-badge";

interface StatusTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromStatus: WorkflowStatus;
  toStatus: WorkflowStatus;
  onSubmit: (comment: string) => void;
  requireComment?: boolean;
}

export function StatusTransitionModal({
  isOpen,
  onClose,
  fromStatus,
  toStatus,
  onSubmit,
  requireComment = false,
}: StatusTransitionModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (requireComment && !comment.trim()) {
      return;
    }
    onSubmit(comment);
    setComment("");
    onClose();
  };

  const handleCancel = () => {
    setComment("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Change Workflow Status"
      size="md"
    >
      <div className="space-y-4">
        {/* Status Preview */}
        <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">From:</span>
              <StatusBadge status={fromStatus} />
            </div>
            <span className="text-[var(--muted-foreground)]">→</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">To:</span>
              <StatusBadge status={toStatus} />
            </div>
          </div>
        </div>

        {/* Comment Field */}
        <div className="space-y-2">
          <Label htmlFor="comment">
            Comment {requireComment && <span className="text-[var(--danger)]">*</span>}
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              requireComment
                ? "Comment is required for this action"
                : "Add a comment (optional)"
            }
            rows={4}
            className="resize-none"
          />
          {requireComment && !comment.trim() && (
            <p className="text-sm text-[var(--danger)]">
              Comment is required for this action
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={requireComment && !comment.trim()}
            className={
              toStatus === "rejected"
                ? "!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--danger)] hover:!bg-[color-mix(in srgb, var(--danger) 85%, black)] active:!bg-[color-mix(in srgb, var(--danger) 75%, black)] !text-white !border-[var(--danger)] hover:!border-[color-mix(in srgb, var(--danger) 85%, black)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--danger)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
                : "!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--primary)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
            }
          >
            {toStatus === "rejected" ? "Reject" : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

