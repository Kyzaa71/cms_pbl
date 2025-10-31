"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Clock } from "lucide-react";
import { AssignmentsList } from "@/components/workflow-management/assignments-list";
import {
  dummyAssignments,
  getAssignmentsByUserId,
  currentUserRole,
} from "@/components/workflow-management/types";

// Mock current user ID (in real app, this would come from auth context)
const currentUserId = 2;

export default function AssignmentsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter assignments
  const myAssignments = getAssignmentsByUserId(currentUserId);
  const filteredAssignments =
    statusFilter === "all"
      ? myAssignments
      : myAssignments.filter((a) => a.status === statusFilter);

  const handleComplete = (assignmentId: number) => {
    if (confirm("Mark this assignment as completed?")) {
      console.log("Complete assignment:", assignmentId);
      // In real app, this would call API
    }
  };

  const stats = {
    total: myAssignments.length,
    pending: myAssignments.filter((a) => a.status === "pending").length,
    completed: myAssignments.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            My Assignments
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            View and manage your assigned content entries
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/workflow-management")}
        >
          Back to Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Assignments</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Assignments List */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <AssignmentsList
          assignments={filteredAssignments}
          onComplete={handleComplete}
          showActions={true}
        />
      </Card>
    </div>
  );
}

