"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Layers, Folder, GitBranch, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function OrgWorkspaceHomePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href={`/organizational/${id}/workspace/content-builder`} className="block group h-full">
          <Card className="h-full p-6 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:shadow-lg transition-all duration-200 rounded-xl relative overflow-hidden group-hover:border-[var(--primary)]/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-80" />
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                <Layers className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-500 mb-1 uppercase tracking-wider">Schema</p>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-blue-600 transition-colors">Content Builder</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Design content structures and manage fields specific to this organization.
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/organizational/${id}/workspace/entries`} className="block group h-full">
          <Card className="h-full p-6 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:shadow-lg transition-all duration-200 rounded-xl relative overflow-hidden group-hover:border-[var(--primary)]/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-80" />
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
                <Folder className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-500 mb-1 uppercase tracking-wider">Content</p>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-emerald-600 transition-colors">Content Entries</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Create, edit, and manage content entries for your organization.
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/organizational/${id}/workspace/workflow`} className="block group h-full">
          <Card className="h-full p-6 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:shadow-lg transition-all duration-200 rounded-xl relative overflow-hidden group-hover:border-[var(--primary)]/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-80" />
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
                <GitBranch className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-500 mb-1 uppercase tracking-wider">Process</p>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-amber-600 transition-colors">Workflow</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Track content status and manage workflow transitions.
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/organizational/${id}/workspace/approval`} className="block group h-full">
          <Card className="h-full p-6 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:shadow-lg transition-all duration-200 rounded-xl relative overflow-hidden group-hover:border-[var(--primary)]/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-80" />
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-200">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-purple-500 mb-1 uppercase tracking-wider">Approval</p>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-purple-600 transition-colors">Approval Queue</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Review pending items and process content approvals.
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
