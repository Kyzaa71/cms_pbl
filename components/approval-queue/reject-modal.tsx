"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { XCircle, AlertTriangle } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryTitle: string;
  onSubmit: (comment: string) => void;
}

export function RejectModal({
  isOpen,
  onClose,
  entryTitle,
  onSubmit,
}: RejectModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(comment.trim());
    setComment("");
  };

  const handleCancel = () => {
    setComment("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Reject Entry"
      size="md"
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Rejection requires a comment
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Please provide a reason for rejecting this entry to help the creator improve it.
            </p>
          </div>
        </div>

        {/* Entry Info */}
        <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)] mb-1">Entry:</p>
          <p className="font-medium text-[var(--foreground)]">{entryTitle}</p>
        </div>

        {/* Status Preview */}
        <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">From:</span>
              <StatusBadge status="ready_for_approval" />
            </div>
            <span className="text-[var(--muted-foreground)]">→</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">To:</span>
              <StatusBadge status="rejected" />
            </div>
          </div>
        </div>

        {/* Comment Field */}
        <div className="space-y-2">
          <Label htmlFor="comment">
            Rejection Reason <span className="text-[var(--danger)]">*</span>
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please provide a reason for rejection (required)..."
            rows={4}
            className="resize-none"
          />
          {!comment.trim() && (
            <p className="text-sm text-[var(--danger)]">
              A rejection reason is required
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
            disabled={!comment.trim()}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--danger)] hover:!bg-[color-mix(in srgb, var(--danger) 85%, black)] active:!bg-[color-mix(in srgb, var(--danger) 75%, black)] !text-white !border-[var(--danger)] hover:!border-[color-mix(in srgb, var(--danger) 85%, black)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--danger)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
}

