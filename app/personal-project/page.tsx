"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Plus, Shuffle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { workflowService } from "@/lib/services/workflow-service";
import { WorkflowAssignment, WorkflowStatus } from "@/types/backend-models";
import { format } from "date-fns";
import { Modal } from "@/components/ui/modal";

export default function PersonalProjectPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<WorkflowAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<WorkflowAssignment | null>(null);

  const fetchAssignments = async () => {
    try {
      const data = await workflowService.myAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const openCompleteModal = (assignment: WorkflowAssignment) => {
    setSelectedAssignment(assignment);
    setShowCompleteModal(true);
  };

  const handleComplete = async (requestReview: boolean) => {
    if (!selectedAssignment) return;
    try {
      await workflowService.completeAssignment(selectedAssignment.id, requestReview);
      fetchAssignments();
      setShowCompleteModal(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error("Failed to complete assignment:", error);
      alert("Failed to complete assignment");
    }
  };

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Personal Project</h1>

      {/* Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">Project Name</th>
              <th className="py-3 px-4 font-medium">Assigned By</th>
              <th className="py-3 px-4 font-medium">Due Date</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
               <tr>
                 <td colSpan={5} className="py-8 text-center text-[var(--muted-foreground)]">
                   Loading...
                 </td>
               </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--muted-foreground)]">
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((assignment, index) => {
                const entryData = assignment.entry?.data as Record<string, any> | undefined;
                const title = entryData?.title || entryData?.name || `Entry #${assignment.entry_id}`;
                
                return (
                  <tr
                    key={assignment.id}
                    className={`border-t border-[var(--border)] ${
                      index % 2 === 0
                        ? "bg-[var(--card-bg-inner)]"
                        : "bg-[var(--card-bg)]"
                    } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
                  >
                    <td className="py-3 px-4 font-medium">
                        {title}
                        <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                            Last update: {assignment.updated_at ? format(new Date(assignment.updated_at), "dd MMM yyyy, HH:mm") : "-"}
                        </div>
                    </td>
                    <td className="py-3 px-4">
                        {assignment.assigner?.name || "Unknown"}
                    </td>
                    <td className="py-3 px-4">
                        {assignment.due_date ? format(new Date(assignment.due_date), "dd MMM yyyy") : "-"}
                    </td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        assignment.status === "completed"
                          ? "text-[var(--success)]"
                          : "text-[var(--warning)]"
                      }`}
                    >
                      {assignment.status}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        {/* Go to Project */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Entry"
                          className="text-[var(--secondary)] hover:text-[color-mix(in srgb, var(--secondary) 80%, black)]"
                          onClick={() =>
                            router.push(`/workflow-management/${assignment.entry_id}`)
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>

                        {/* Complete Assignment */}
                        {assignment.status !== "completed" && (
                            <Button
                            variant="ghost"
                            size="icon"
                            title="Complete Assignment"
                            className="text-[var(--success)] hover:text-[color-mix(in srgb, var(--success) 80%, black)]"
                            onClick={() => openCompleteModal(assignment)}
                            >
                            <CheckCircle className="h-4 w-4" />
                            </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Complete Assignment Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Assignment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--muted-foreground)]">
            How would you like to complete this assignment?
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => handleComplete(false)}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
            >
              Complete Only
            </Button>
            {selectedAssignment?.entry?.status === "draft" && (
              <Button 
                onClick={() => handleComplete(true)}
                variant="outline"
                className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
              >
                Complete & Request Review
              </Button>
            )}
            <Button 
              onClick={() => setShowCompleteModal(false)}
              variant="ghost"
              className="w-full mt-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
