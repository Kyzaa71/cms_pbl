"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { CheckCircle } from "lucide-react";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryTitle: string;
  onSubmit: (comment?: string) => void;
}

export function ApproveModal({
  isOpen,
  onClose,
  entryTitle,
  onSubmit,
}: ApproveModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(comment.trim() || undefined);
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
      title="Approve Entry"
      size="md"
    >
      <div className="space-y-4">
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
              <StatusBadge status="approved" />
            </div>
          </div>
        </div>

        {/* Comment Field */}
        <div className="space-y-2">
          <Label htmlFor="comment">Comment (Optional)</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add an optional comment for approval..."
            rows={4}
            className="resize-none"
          />
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
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-green-600 hover:!bg-green-700 active:!bg-green-800 !text-white !border-green-600 hover:!border-green-700 !cursor-pointer"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
}

