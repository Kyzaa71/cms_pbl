"use client";

import { WorkflowHistory, formatDateTime, getInitials } from "./types";
import { StatusBadge } from "./status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface WorkflowHistoryTimelineProps {
  history: WorkflowHistory[];
}

export function WorkflowHistoryTimeline({
  history,
}: WorkflowHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        No workflow history available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

      {/* Timeline Items */}
      <div className="space-y-6">
        {history.map((item, index) => (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline Dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[var(--card-bg-inner)] border-2 border-[var(--border)] flex items-center justify-center">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(item.user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {item.user.name}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {item.user.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>

                {/* Status Change */}
                <div className="flex items-center gap-2 mb-3">
                  <StatusBadge status={item.fromStatus} />
                  <span className="text-[var(--muted-foreground)]">→</span>
                  <StatusBadge status={item.toStatus} />
                </div>

                {/* Comment */}
                {item.comment && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
                      {item.comment}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

