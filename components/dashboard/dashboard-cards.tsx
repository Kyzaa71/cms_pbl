"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  Building2,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Settings,
  TrendingUp,
  FileText,
  Image,
  SendToBack,
  Eye,
  ArrowRight,
  Plus,
  Upload,
  CheckSquare,
  XCircle,
} from "lucide-react";
import {
  mockPersonalProjects,
  mockOrganizationalProjects,
  mockProjectDeadlines,
  mockProjectDetails,
  mockContentStats,
  mockApprovalQueueItems,
  mockWorkflowStatusBreakdown,
  mockActivities,
  mockMediaStats,
  mockOrganizations,
} from "./dashboard-types";

export function DashboardCards() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Urgent":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">
            {status}
          </Badge>
        );
      case "On Track":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0">
            Low
          </Badge>
        );
    }
  };

  const getActivityIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      FileText,
      CheckCircle2,
      Settings,
      Image,
      SendToBack,
      Megaphone,
    };
    return iconMap[iconName] || FileText;
  };

  const totalPersonalProjects = mockPersonalProjects.length;
  const totalOrgProjects = mockOrganizationalProjects.length;
  const totalOrganizations = mockOrganizations.length;
  const totalCollaborators = mockOrganizations.reduce(
    (sum, org) => sum + org.members,
    0
  );

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/personal-project">
          <Button
            variant="outline"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </Link>
        <Link href="/approval-queue">
          <Button
            variant="outline"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            View Approvals ({mockApprovalQueueItems.length})
          </Button>
        </Link>
        <Link href="/assets">
          <Button
            variant="outline"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </Button>
        </Link>
        <Link href="/content-management">
          <Button
            variant="outline"
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Create Content
          </Button>
        </Link>
      </div>

      {/* KPI Cards - Project Management */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Project Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)] border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Personal Project</p>
                <p className="text-2xl font-bold">{totalPersonalProjects}</p>
              </div>
              <User className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-[var(--secondary)] to-purple-700 text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Organization Project</p>
                <p className="text-2xl font-bold">{totalOrgProjects}</p>
              </div>
              <Building2 className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-[var(--success)] to-[var(--success-hover)] text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Organization</p>
                <p className="text-2xl font-bold">{totalOrganizations}</p>
              </div>
              <Building2 className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Collaborator</p>
                <p className="text-2xl font-bold">{totalCollaborators}</p>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        </div>
      </div>

      {/* KPI Cards - CMS Content Management */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Content Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Entries</p>
                <p className="text-2xl font-bold">{mockContentStats.totalEntries}</p>
              </div>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Published</p>
                <p className="text-2xl font-bold">{mockContentStats.published}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-gray-500 to-gray-600 text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Draft</p>
                <p className="text-2xl font-bold">{mockContentStats.draft}</p>
              </div>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Pending Approval</p>
                <p className="text-2xl font-bold">{mockContentStats.pendingApproval}</p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        </div>
      </div>

      {/* Middle Row - Project Management & CMS Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Deadlines */}
        <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-semibold text-lg text-[var(--foreground)]">
                Project Deadlines
              </h2>
            </div>
            <Link href="/personal-project">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockProjectDeadlines.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-md bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--foreground)] mb-1">{p.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{p.deadline}</span>
                  </div>
                </div>
                <div className="ml-4 shrink-0">{getStatusBadge(p.status)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Approval Queue Summary */}
        <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-semibold text-lg text-[var(--foreground)]">
                Approval Queue
              </h2>
            </div>
            <Link href="/approval-queue">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
            {mockApprovalQueueItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-md bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] mb-1">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <span>{item.contentType}</span>
                      <span>•</span>
                      <span>{item.creator}</span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">{getPriorityBadge(item.priority)}</div>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Submitted {item.submittedAt}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Second Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-semibold text-lg text-[var(--foreground)]">
                Project Details
              </h2>
            </div>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
            {mockProjectDetails.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-md bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-[var(--foreground)]">{proj.name}</p>
                  <span className="text-sm font-semibold text-[var(--primary)]">
                    {proj.progress}%
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mb-3">
                  {proj.description}
                </p>
                <Progress value={proj.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Workflow Status Breakdown */}
        <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-semibold text-lg text-[var(--foreground)]">
                Workflow Status
              </h2>
            </div>
            <Link href="/workflow-management">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
            {mockWorkflowStatusBreakdown.map((workflow, idx) => (
              <div
                key={idx}
                className="p-4 rounded-md bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
              >
                <p className="font-medium text-[var(--foreground)] mb-3">
                  {workflow.contentType}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[var(--muted-foreground)]">Draft:</span>
                    <span className="ml-1 font-semibold text-[var(--foreground)]">
                      {workflow.draft}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Published:</span>
                    <span className="ml-1 font-semibold text-green-500">
                      {workflow.published}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">Pending:</span>
                    <span className="ml-1 font-semibold text-orange-500">
                      {workflow.readyForApproval}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row - Activity Feed & Media Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-semibold text-lg text-[var(--foreground)]">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {mockActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.icon);
              return (
                <div
                  key={activity.id}
                  className={`p-3 rounded-md border border-[var(--border)] ${activity.bgColor} hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-2.5">
                    <IconComponent
                      className={`w-4 h-4 ${activity.color} shrink-0 mt-0.5`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--foreground)] leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Media & Organizations */}
        <div className="space-y-6">
          {/* Media Overview */}
          <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="font-semibold text-lg text-[var(--foreground)]">
                  Media Library
                </h2>
              </div>
              <Link href="/assets">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-[var(--card-bg)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">
                    Total Files
                  </p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {mockMediaStats.totalFiles.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-[var(--card-bg)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">
                    Storage Used
                  </p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {mockMediaStats.totalSize}
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-md bg-[var(--card-bg)] border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] mb-2">
                  Recent Uploads (24h)
                </p>
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {mockMediaStats.recentUploads} files
                </p>
              </div>
            </div>
          </Card>

          {/* List Organization */}
          <Card className="p-5 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="font-semibold text-lg text-[var(--foreground)]">
                  Organizations
                </h2>
              </div>
              <Link href="/organizational">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="p-3 rounded-md border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <Building2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    <p className="font-medium text-sm text-[var(--foreground)]">
                      {org.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {org.members} members
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {org.lastUpdate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

