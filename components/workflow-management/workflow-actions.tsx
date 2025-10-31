"use client";

import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle,
  XCircle,
  SendToBack,
  FileText,
  RefreshCw,
} from "lucide-react";
import { WorkflowStatus, getAvailableTransitions, currentUserRole } from "./types";
import { StatusBadge } from "./status-badge";

interface WorkflowActionsProps {
  currentStatus: WorkflowStatus;
  onStatusChange: (toStatus: WorkflowStatus, comment?: string) => void;
  entryId: number;
}

export function WorkflowActions({
  currentStatus,
  onStatusChange,
  entryId,
}: WorkflowActionsProps) {
  const availableTransitions = getAvailableTransitions(currentStatus, currentUserRole);

  if (availableTransitions.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status={currentStatus} />
        <span className="text-sm text-[var(--muted-foreground)]">
          No actions available for your role
        </span>
      </div>
    );
  }

  const handleAction = (toStatus: WorkflowStatus) => {
    // This will open the status transition modal
    // For now, we'll pass the action to parent
    onStatusChange(toStatus);
  };

  const getActionButton = (transition: { toStatus: WorkflowStatus; requiredRole: string }) => {
    const { toStatus } = transition;
    const labels: Record<WorkflowStatus, { label: string; icon: JSX.Element; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: {
        label: "Save as Draft",
        icon: <FileText className="h-4 w-4" />,
        variant: "outline",
      },
      in_review: {
        label: "Request Review",
        icon: <Send className="h-4 w-4" />,
        variant: "default",
      },
      ready_for_approval: {
        label: "Mark Ready for Approval",
        icon: <SendToBack className="h-4 w-4" />,
        variant: "default",
      },
      approved: {
        label: "Approve",
        icon: <CheckCircle className="h-4 w-4" />,
        variant: "default",
      },
      published: {
        label: "Publish",
        icon: <Send className="h-4 w-4" />,
        variant: "default",
      },
      rejected: {
        label: "Reject",
        icon: <XCircle className="h-4 w-4" />,
        variant: "destructive",
      },
    };

    const action = labels[toStatus];

    // Enhanced button styles with clear visual distinction
    const getButtonClassName = () => {
      const baseClasses = "!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !cursor-pointer";
      
      switch (toStatus) {
        case "draft":
          return `${baseClasses} !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)]`;
        case "in_review":
          return `${baseClasses} !bg-blue-600 hover:!bg-blue-700 active:!bg-blue-800 !text-white !border-blue-600 hover:!border-blue-700`;
        case "ready_for_approval":
          return `${baseClasses} !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)]`;
        case "approved":
          return `${baseClasses} !bg-green-600 hover:!bg-green-700 active:!bg-green-800 !text-white !border-green-600 hover:!border-green-700`;
        case "published":
          return `${baseClasses} !bg-purple-600 hover:!bg-purple-700 active:!bg-purple-800 !text-white !border-purple-600 hover:!border-purple-700`;
        case "rejected":
          return `${baseClasses} !bg-[var(--danger)] hover:!bg-[color-mix(in srgb, var(--danger) 85%, black)] active:!bg-[color-mix(in srgb, var(--danger) 75%, black)] !text-white !border-[var(--danger)] hover:!border-[color-mix(in srgb, var(--danger) 85%, black)]`;
        default:
          return baseClasses;
      }
    };

    return (
      <Button
        key={toStatus}
        variant={action.variant}
        size="sm"
        onClick={() => handleAction(toStatus)}
        className={getButtonClassName()}
      >
        {action.icon}
        <span className="ml-2">{action.label}</span>
      </Button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status={currentStatus} />
      <div className="flex flex-wrap gap-2">
        {availableTransitions.map((transition) =>
          getActionButton(transition)
        )}
      </div>
    </div>
  );
}

