"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Send } from "lucide-react";
import { ApproveModal } from "./approve-modal";
import { RejectModal } from "./reject-modal";
import { PublishModal } from "./publish-modal";
import { WorkflowStatus } from "@/components/workflow-management/types";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { projectService } from "@/lib/services/project-service";
import { useEffect, useState } from "react";


interface ApprovalActionsProps {
  entryId: number;
  entryTitle: string;
  onApprove: (entryId: number, comment?: string) => void;
  onReject: (entryId: number, comment: string) => void;
  status: WorkflowStatus;
  onPublish?: (entryId: number, comment?: string) => void;
  onBackToDraft?: (entryId: number) => void;
}

export function ApprovalActions({
  entryId,
  entryTitle,
  onApprove,
  onReject,
  status,
  onPublish,
  onBackToDraft,
}: ApprovalActionsProps) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const { user, can } = useAuth();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("project_id");
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  const [projectRoleName, setProjectRoleName] = useState<string>("");
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!projectId || !user?.id) { setProjectRoleName(""); return; }
      try {
        const members = await projectService.getProjectMembers(projectId);
        const me = members.find((m) => m.user_id === user.id);
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    load();
    return () => { active = false; };
  }, [projectId, user?.id]);
  const globalRoleKey = ((user?.role?.name || "").toLowerCase().replace(/[\s_-]+/g, "").trim());
  const projectRoleKey = ((projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "").trim());
  const canApprove = status === "ready_for_approval" && (
    globalRoleKey === "admin" ||
    globalRoleKey === "manager" ||
    projectRoleKey === "projectowner" ||
    projectRoleKey === "projectadmin"
  );
  const canReject = status === "ready_for_approval" && (
    projectRoleKey === "projectowner" ||
    projectRoleKey === "projectadmin" ||
    globalRoleKey === "manager" ||
    globalRoleKey === "admin"
  );
  const canPublish = status === "approved" && Boolean(onPublish) && (
    globalRoleKey === "admin" ||
    globalRoleKey === "manager" ||
    projectRoleKey === "projectowner" ||
    projectRoleKey === "projectadmin"
  );
  const canBackToDraft = status === "rejected" && (
    globalRoleKey === "admin" ||
    projectRoleKey === "projectcontentwriter" ||
    projectRoleKey === "projecteditor" ||
    projectRoleKey === "projectadmin"
  );

  const handleApprove = (comment?: string) => {
    onApprove(entryId, comment);
    setShowApproveModal(false);
  };

  const handleReject = (comment: string) => {
    onReject(entryId, comment);
    setShowRejectModal(false);
  };

  const handlePublish = (comment?: string) => {
    if (onPublish) onPublish(entryId, comment);
    setShowPublishModal(false);
  };

  return (
    <>
      <div className="flex gap-2 flex-nowrap">
        {canApprove && (
          <>
            <Button
              onClick={() => setShowApproveModal(true)}
              size="sm"
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-green-600 hover:!bg-green-700 active:!bg-green-800 !text-white !border-green-600 hover:!border-green-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Approve
            </Button>
          </>
        )}
        {canReject && (
          <Button
            onClick={() => setShowRejectModal(true)}
            size="sm"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--danger)] hover:!bg-[color-mix(in srgb, var(--danger) 85%, black)] active:!bg-[color-mix(in srgb, var(--danger) 75%, black)] !text-white !border-[var(--danger)] hover:!border-[color-mix(in srgb, var(--danger) 85%, black)] !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
          >
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Reject
          </Button>
        )}
        {canPublish && onPublish && (
          <Button
            onClick={() => setShowPublishModal(true)}
            size="sm"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-purple-600 hover:!bg-purple-700 active:!bg-purple-800 !text-white !border-purple-600 hover:!border-purple-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Publish
          </Button>
        )}
        {canBackToDraft && onBackToDraft && (
          <Button
            onClick={() => onBackToDraft(entryId)}
            size="sm"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-gray-600 hover:!bg-gray-700 active:!bg-gray-800 !text-white !border-gray-600 hover:!border-gray-700 !cursor-pointer !text-xs !px-3 !py-1.5 !h-auto shrink-0"
          >
            Back to Draft
          </Button>
        )}
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

      {showPublishModal && (
        <PublishModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          entryTitle={entryTitle}
          onSubmit={handlePublish}
        />
      )}
    </>
  );
}
