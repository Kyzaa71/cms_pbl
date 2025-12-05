"use client";

import { formatDateTime, getInitials } from "./types";
import type { WorkflowAssignment } from "@/types/backend-models";
import { StatusBadge } from "./status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssignmentsListProps {
  assignments: WorkflowAssignment[];
  onComplete?: (assignmentId: number) => void;
  showActions?: boolean;
}

export function AssignmentsList({
  assignments,
  onComplete,
  showActions = true,
}: AssignmentsListProps) {
  const router = useRouter();

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        No assignments found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
            <th className="py-3 px-4 font-medium">Entry</th>
            <th className="py-3 px-4 font-medium">Assigned To</th>
            <th className="py-3 px-4 font-medium">Assigned By</th>
            <th className="py-3 px-4 font-medium">Due Date</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Created</th>
            {showActions && (
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr
              key={assignment.id}
              className={`border-t border-[var(--border)] ${
                index % 2 === 0
                  ? "bg-[var(--card-bg-inner)]"
                  : "bg-[var(--card-bg)]"
              } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {assignment.entry ? `Entry #${assignment.entry.id}` : `Entry #${assignment.entry_id}`}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(assignment.user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-[var(--foreground)]">
                      {assignment.user?.name || "-"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {assignment.user?.email || ""}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(assignment.assigner?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-[var(--foreground)]">
                      {assignment.assigner?.name || "-"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {assignment.assigner?.email || ""}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                {assignment.due_date ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">
                      {formatDateTime(assignment.due_date)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[var(--muted-foreground)]">No due date</span>
                )}
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={
                    assignment.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                  }
                >
                  {assignment.status === "completed" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </>
                  ) : (
                    "Pending"
                  )}
                </Badge>
              </td>
              <td className="py-3 px-4 text-[var(--muted-foreground)]">
                {formatDateTime(assignment.created_at)}
              </td>
              {showActions && (
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    {assignment.entry && (
                      <Button
                        variant="ghost"
                        size="icon"
                      onClick={() => router.push(`/workflow-management/${assignment.entry_id}`)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                        title="View Entry"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {assignment.status === "pending" && onComplete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onComplete(assignment.id)}
                        className="text-green-600 hover:text-[color-mix(in srgb, green 80%, black)] dark:text-green-500"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

