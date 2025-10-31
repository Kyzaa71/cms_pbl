"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Filter, FileText, Clock, AlertCircle } from "lucide-react";
import {
  getApprovalQueueEntries,
  getApprovalQueueEntriesByContentType,
  getApprovalQueueStats,
  dummyContentTypes,
  getInitials,
  formatDate,
  ContentEntry,
} from "@/components/approval-queue/types";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { ApprovalActions } from "@/components/approval-queue/approval-actions";

export default function ApprovalQueuePage() {
  const router = useRouter();
  const [entries] = useState<ContentEntry[]>(getApprovalQueueEntries());
  const [searchQuery, setSearchQuery] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContentType =
      contentTypeFilter === "all" ||
      entry.contentTypeId.toString() === contentTypeFilter;
    return matchesSearch && matchesContentType;
  });

  // Stats
  const stats = getApprovalQueueStats();

  const handleView = (entryId: number) => {
    router.push(`/workflow-management/${entryId}`);
  };

  const handleApprove = (entryId: number, comment?: string) => {
    console.log("Approve entry:", entryId, comment);
    // In real app, this would call API: POST /workflow/entries/:entry_id/approve
    // Entry status would change to "approved" and be removed from queue
    alert(`Entry ${entryId} approved${comment ? ` with comment: ${comment}` : ""}`);
  };

  const handleReject = (entryId: number, comment: string) => {
    console.log("Reject entry:", entryId, comment);
    // In real app, this would call API: POST /workflow/entries/:entry_id/reject
    // Entry status would change to "rejected" and be removed from queue
    alert(`Entry ${entryId} rejected with reason: ${comment}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Approval Queue
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Review and approve content entries ready for approval
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/workflow-management")}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          View All Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Approvals</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        {stats.byContentType.map((stat) => (
          <Card
            key={stat.contentType.id}
            className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.contentType.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.count}</p>
              </div>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        ))}
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

          {/* Content Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
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
        </div>
      </Card>

      {/* Entries Table */}
      {filteredEntries.length > 0 ? (
        <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Content Type</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Creator</th>
                <th className="py-3 px-4 font-medium">Submitted</th>
                <th className="py-3 px-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, index) => (
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
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(entry.id)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <ApprovalActions
                        entryId={entry.id}
                        entryTitle={entry.title}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="p-12 text-center bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <AlertCircle className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            No entries pending approval
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            All entries have been reviewed or there are no entries ready for approval at this time.
          </p>
        </Card>
      )}
    </div>
  );
}

