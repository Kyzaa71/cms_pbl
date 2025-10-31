// Types and helpers for Approval Queue
// Reuses types from workflow-management

import {
  ContentEntry,
  WorkflowStatus,
  dummyEntries,
  dummyContentTypes,
  getInitials,
  formatDate,
  formatDateTime,
} from "@/components/workflow-management/types";

// Re-export types for convenience
export type { ContentEntry, WorkflowStatus };

// Get entries in approval queue (status = ready_for_approval)
export const getApprovalQueueEntries = (): ContentEntry[] => {
  return dummyEntries.filter((entry) => entry.status === "ready_for_approval");
};

// Get approval queue entries by content type
export const getApprovalQueueEntriesByContentType = (
  contentTypeId?: number
): ContentEntry[] => {
  const queueEntries = getApprovalQueueEntries();
  if (!contentTypeId) return queueEntries;
  return queueEntries.filter((entry) => entry.contentTypeId === contentTypeId);
};

// Get approval queue statistics
export const getApprovalQueueStats = () => {
  const queueEntries = getApprovalQueueEntries();
  
  return {
    total: queueEntries.length,
    byContentType: dummyContentTypes.map((type) => ({
      contentType: type,
      count: queueEntries.filter((e) => e.contentTypeId === type.id).length,
    })),
  };
};

// Export helpers
export { dummyContentTypes, getInitials, formatDate, formatDateTime };

