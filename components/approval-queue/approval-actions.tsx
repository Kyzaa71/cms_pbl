"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { ApproveModal } from "./approve-modal";
import { RejectModal } from "./reject-modal";

interface ApprovalActionsProps {
  entryId: number;
  entryTitle: string;
  onApprove: (entryId: number, comment?: string) => void;
  onReject: (entryId: number, comment: string) => void;
}

export function ApprovalActions({
  entryId,
  entryTitle,
  onApprove,
  onReject,
}: ApprovalActionsProps) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (comment?: string) => {
    onApprove(entryId, comment);
    setShowApproveModal(false);
  };

  const handleReject = (comment: string) => {
    onReject(entryId, comment);
    setShowRejectModal(false);
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setShowApproveModal(true)}
          size="sm"
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-green-600 hover:!bg-green-700 active:!bg-green-800 !text-white !border-green-600 hover:!border-green-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto"
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          Approve
        </Button>
        <Button
          onClick={() => setShowRejectModal(true)}
          size="sm"
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--danger)] hover:!bg-[color-mix(in srgb, var(--danger) 85%, black)] active:!bg-[color-mix(in srgb, var(--danger) 75%, black)] !text-white !border-[var(--danger)] hover:!border-[color-mix(in srgb, var(--danger) 85%, black)] !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto"
        >
          <XCircle className="h-3.5 w-3.5 mr-1.5" />
          Reject
        </Button>
      </div>

      {showApproveModal && (
        <ApproveModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          entryTitle={entryTitle}
          onSubmit={handleApprove}
        />
      )}

      {showRejectModal && (
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          entryTitle={entryTitle}
          onSubmit={handleReject}
        />
      )}
    </>
  );
}

