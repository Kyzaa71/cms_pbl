"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { getWorkflowStatistics } from "@/components/workflow-management/types";
import { StatusBadge } from "@/components/workflow-management/status-badge";

export default function WorkflowStatisticsPage() {
  const router = useRouter();
  const statistics = getWorkflowStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/workflow-management")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Workflow Statistics
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              View statistics by content type and workflow status
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6">
        {statistics.map((stat) => (
          <Card
            key={stat.contentTypeId}
            className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {stat.contentType?.name || `Content Type #${stat.contentTypeId}`}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Total Entries: {stat.totalEntries}
              </p>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Draft</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.draftCount}
                </p>
              </div>
              <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">In Review</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.inReviewCount}
                </p>
              </div>
              <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Ready</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.readyForApprovalCount}
                </p>
              </div>
              <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Approved</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.approvedCount}
                </p>
              </div>
              <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Published</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.publishedCount}
                </p>
              </div>
              <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Rejected</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {stat.rejectedCount}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {statistics.length === 0 && (
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          No statistics available
        </div>
      )}
    </div>
  );
}

