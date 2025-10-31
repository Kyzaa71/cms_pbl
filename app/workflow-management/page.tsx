"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Eye,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  SendToBack,
} from "lucide-react";
import {
  dummyEntries,
  dummyContentTypes,
  getEntriesByStatus,
  getInitials,
  formatDate,
  WorkflowStatus,
  ContentEntry,
} from "@/components/workflow-management/types";
import { StatusBadge } from "@/components/workflow-management/status-badge";

export default function WorkflowManagementPage() {
  const router = useRouter();
  const [entries] = useState<ContentEntry[]>(dummyEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || entry.status === statusFilter;
    const matchesContentType =
      contentTypeFilter === "all" ||
      entry.contentTypeId.toString() === contentTypeFilter;
    return matchesSearch && matchesStatus && matchesContentType;
  });

  // Stats
  const stats = {
    total: entries.length,
    draft: getEntriesByStatus("draft").length,
    inReview: getEntriesByStatus("in_review").length,
    readyForApproval: getEntriesByStatus("ready_for_approval").length,
    approved: getEntriesByStatus("approved").length,
    published: getEntriesByStatus("published").length,
    rejected: getEntriesByStatus("rejected").length,
  };

  const handleView = (entryId: number) => {
    router.push(`/workflow-management/${entryId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Workflow Management
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage content workflow, approvals, and status transitions
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/workflow-management/statistics">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Statistics
            </Button>
          </Link>
          <Link href="/workflow-management/assignments">
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              My Assignments
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Draft</p>
              <p className="text-2xl font-bold mt-1">{stats.draft}</p>
            </div>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">In Review</p>
              <p className="text-2xl font-bold mt-1">{stats.inReview}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ready</p>
              <p className="text-2xl font-bold mt-1">{stats.readyForApproval}</p>
            </div>
            <SendToBack className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Approved</p>
              <p className="text-2xl font-bold mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Published</p>
              <p className="text-2xl font-bold mt-1">{stats.published}</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected</p>
              <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="ready_for_approval">Ready for Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Type Filter */}
          <Select
            value={contentTypeFilter}
            onValueChange={setContentTypeFilter}
          >
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content Types</SelectItem>
              {dummyContentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Entries Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">Title</th>
              <th className="py-3 px-4 font-medium">Content Type</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Creator</th>
              <th className="py-3 px-4 font-medium">Last Updated</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-t border-[var(--border)] ${
                    index % 2 === 0
                      ? "bg-[var(--card-bg-inner)]"
                      : "bg-[var(--card-bg)]"
                  } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-[var(--foreground)]">
                      {entry.title}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[var(--muted-foreground)]">
                      {entry.contentType.name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(entry.creator.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-[var(--foreground)]">
                          {entry.creator.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {entry.creator.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">
                    {formatDate(entry.updatedAt)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(entry.id)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

