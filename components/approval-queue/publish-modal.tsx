"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { Send } from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryTitle: string;
  onSubmit: (comment?: string) => void;
}

export function PublishModal({
  isOpen,
  onClose,
  entryTitle,
  onSubmit,
}: PublishModalProps) {
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
      title="Publish Entry"
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)] mb-1">Entry:</p>
          <p className="font-medium text-[var(--foreground)]">{entryTitle}</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">From:</span>
              <StatusBadge status="approved" />
            </div>
            <span className="text-[var(--muted-foreground)]">→</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">To:</span>
              <StatusBadge status="published" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Comment (Optional)</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add an optional comment for publish..."
            rows={4}
            className="resize-none"
          />
        </div>

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
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-purple-600 hover:!bg-purple-700 active:!bg-purple-800 !text-white !border-purple-600 hover:!border-purple-700 !cursor-pointer"
          >
            <Send className="h-4 w-4 mr-2" />
            Publish Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
}
