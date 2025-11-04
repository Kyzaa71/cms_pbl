"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  SendToBack,
} from "lucide-react";
import {
  getContentTypeById,
} from "@/components/content-builder/types";
import {
  getEntriesByContentType,
  getEntryTitle,
  getStatusBadgeColor,
  getStatusLabel,
  formatDate,
  type WorkflowStatus,
  type ContentEntry,
  dummyUsers,
} from "@/components/content-management/types";
import { getInitials } from "@/components/user-management/types";

export default function ContentEntriesPage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeId = parseInt(params.contentTypeId as string);

  const [contentType, setContentType] = useState<any>(null);
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createdByFilter, setCreatedByFilter] = useState<string>("all");

  useEffect(() => {
    const ct = getContentTypeById(contentTypeId);
    setContentType(ct);
    
    if (contentTypeId) {
      const entriesData = getEntriesByContentType(contentTypeId);
      setEntries(entriesData);
    }
  }, [contentTypeId]);

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const title = getEntryTitle(entry);
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesCreator = createdByFilter === "all" || entry.createdBy.toString() === createdByFilter;
    return matchesSearch && matchesStatus && matchesCreator;
  });

  // Stats
  const stats = {
    total: entries.length,
    draft: entries.filter((e) => e.status === "draft").length,
    inReview: entries.filter((e) => e.status === "in_review").length,
    readyForApproval: entries.filter((e) => e.status === "ready_for_approval").length,
    approved: entries.filter((e) => e.status === "approved").length,
    published: entries.filter((e) => e.status === "published").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  // Handlers
  const handleView = (entryId: number) => {
    router.push(`/content-management/${contentTypeId}/entries/${entryId}`);
  };

  const handleEdit = (entryId: number) => {
    router.push(`/content-management/${contentTypeId}/entries/${entryId}`);
  };

  const handleDelete = (entry: ContentEntry) => {
    if (entry.status === "published") {
      alert("Cannot delete published entries. Please unpublish first.");
      return;
    }

    if (confirm(`Are you sure you want to delete this entry?`)) {
      // In a real app, this would call an API
      const updatedEntries = entries.filter((e) => e.id !== entry.id);
      setEntries(updatedEntries);
      console.log("Delete entry:", entry.id);
    }
  };

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-management">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/content-management">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              {contentType.name} Entries
            </h1>
              <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
                Manage all entries for {contentType.name} content type. Edit content here, use{" "}
                <Link href="/workflow-management" className="text-[var(--primary)] hover:underline">
                  Workflow Management
                </Link>{" "}
                to change status.
              </p>
          </div>
        </div>
        <Link href={`/content-management/${contentTypeId}/create`}>
          <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Entry
          </Button>
        </Link>
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
              placeholder="Search entries..."
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

          {/* Creator Filter */}
          <Select value={createdByFilter} onValueChange={setCreatedByFilter}>
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Created By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Creators</SelectItem>
              {dummyUsers.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Entries Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Created By</th>
              <th className="py-3 px-4 font-semibold">Updated</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--card-bg-inner)]">
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No entries found. Create your first entry to get started.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, index) => {
                const title = getEntryTitle(entry);
                const creator = entry.creator || dummyUsers.find(u => u.id === entry.createdBy);
                return (
                  <tr
                    key={entry.id}
                    className={`border-t border-[var(--border)] ${
                      index % 2 === 0
                        ? "bg-[var(--card-bg-inner)]"
                        : "bg-[var(--card-bg)]"
                    } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
                  >
                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--foreground)] max-w-md truncate">
                        {title}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusBadgeColor(entry.status)} border-none`}>
                        {getStatusLabel(entry.status)}
                      </Badge>
                    </td>

                    {/* Created By */}
                    <td className="py-3 px-4">
                      {creator && (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)] text-xs">
                              {getInitials(creator.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[var(--foreground)]">
                            {creator.name}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {formatDate(entry.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(entry.id)}
                          className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry.id)}
                          className="text-yellow-600 hover:text-[color-mix(in srgb, yellow 80%, black)] dark:text-yellow-500"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry)}
                          className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

