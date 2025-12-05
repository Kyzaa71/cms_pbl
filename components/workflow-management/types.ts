// Types and dummy data for Workflow Management

export type WorkflowStatus = 
  | "draft" 
  | "in_review" 
  | "ready_for_approval" 
  | "approved" 
  | "published" 
  | "rejected";

export interface ContentEntry {
  id: number;
  title: string;
  contentTypeId: number;
  contentType: {
    id: number;
    name: string;
    slug: string;
  };
  status: WorkflowStatus;
  createdBy: number;
  creator: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  updatedBy?: number;
  updater?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  data?: Record<string, unknown>;
}

export interface WorkflowHistory {
  id: number;
  entryId: number;
  fromStatus: WorkflowStatus;
  toStatus: WorkflowStatus;
  changedBy: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  comment: string;
  createdAt: string;
}

export interface WorkflowComment {
  id: number;
  entryId: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  comment: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface WorkflowAssignment {
  id: number;
  entryId: number;
  entry?: ContentEntry;
  assignedTo: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedBy: number;
  assigner: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  status: "pending" | "completed";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTransition {
  id: number;
  fromStatus: WorkflowStatus;
  toStatus: WorkflowStatus;
  requiredRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStatistics {
  contentTypeId: number;
  contentType?: {
    id: number;
    name: string;
    slug: string;
  };
  totalEntries: number;
  draftCount: number;
  inReviewCount: number;
  readyForApprovalCount: number;
  approvedCount: number;
  publishedCount: number;
  rejectedCount: number;
}

// Current user role (for permission checking)
export const currentUserRole = "editor"; // Can be changed based on auth context

// Dummy Content Types
export const dummyContentTypes = [
  { id: 1, name: "Blog Post", slug: "blog-post" },
  { id: 2, name: "Product Page", slug: "product-page" },
  { id: 3, name: "Landing Page", slug: "landing-page" },
  { id: 4, name: "News Article", slug: "news-article" },
];

// Dummy Users (for assignments, creators, etc.)
export const dummyUsers = [
  {
    id: 1,
    name: "Alvaro Zeka Ricardo",
    email: "alvaro.ricardo@cmlabs.com",
    avatar: undefined,
  },
  {
    id: 2,
    name: "Bayu Yuyu",
    email: "bayu.yuyu@cmlabs.com",
    avatar: undefined,
  },
  {
    id: 3,
    name: "Wawan Awan",
    email: "wawan.awan@cmlabs.com",
    avatar: undefined,
  },
  {
    id: 4,
    name: "Mamat Rahmat",
    email: "mamat.rahmat@cmlabs.com",
    avatar: undefined,
  },
  {
    id: 5,
    name: "Sarah Johnson",
    email: "sarah.johnson@cmlabs.com",
    avatar: undefined,
  },
];

// Dummy Content Entries
export const dummyEntries: ContentEntry[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    contentTypeId: 1,
    contentType: { id: 1, name: "Blog Post", slug: "blog-post" },
    status: "draft",
    createdBy: 2,
    creator: dummyUsers[1],
    updatedBy: 2,
    updater: dummyUsers[1],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: 2,
    title: "Product Launch: New Feature Update",
    contentTypeId: 2,
    contentType: { id: 2, name: "Product Page", slug: "product-page" },
    status: "in_review",
    createdBy: 3,
    creator: dummyUsers[2],
    updatedBy: 3,
    updater: dummyUsers[2],
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
  },
  {
    id: 3,
    title: "Landing Page: Summer Campaign",
    contentTypeId: 3,
    contentType: { id: 3, name: "Landing Page", slug: "landing-page" },
    status: "ready_for_approval",
    createdBy: 2,
    creator: dummyUsers[1],
    updatedBy: 2,
    updater: dummyUsers[1],
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-23T16:30:00Z",
  },
  {
    id: 4,
    title: "Latest Tech News: AI Breakthrough",
    contentTypeId: 4,
    contentType: { id: 4, name: "News Article", slug: "news-article" },
    status: "approved",
    createdBy: 3,
    creator: dummyUsers[2],
    updatedBy: 3,
    updater: dummyUsers[2],
    createdAt: "2024-01-10T12:00:00Z",
    updatedAt: "2024-01-24T10:15:00Z",
  },
  {
    id: 5,
    title: "Product Review: Best Practices",
    contentTypeId: 1,
    contentType: { id: 1, name: "Blog Post", slug: "blog-post" },
    status: "published",
    createdBy: 2,
    creator: dummyUsers[1],
    updatedBy: 5,
    updater: dummyUsers[4],
    createdAt: "2024-01-05T07:30:00Z",
    updatedAt: "2024-01-25T09:00:00Z",
    publishedAt: "2024-01-25T09:00:00Z",
  },
  {
    id: 6,
    title: "Draft Article: Testing Workflow",
    contentTypeId: 1,
    contentType: { id: 1, name: "Blog Post", slug: "blog-post" },
    status: "rejected",
    createdBy: 3,
    creator: dummyUsers[2],
    updatedBy: 5,
    updater: dummyUsers[4],
    createdAt: "2024-01-12T13:20:00Z",
    updatedAt: "2024-01-21T15:45:00Z",
  },
  {
    id: 7,
    title: "How to Optimize SEO in 2024",
    contentTypeId: 1,
    contentType: { id: 1, name: "Blog Post", slug: "blog-post" },
    status: "draft",
    createdBy: 4,
    creator: dummyUsers[3],
    updatedBy: 4,
    updater: dummyUsers[3],
    createdAt: "2024-01-26T11:00:00Z",
    updatedAt: "2024-01-26T11:00:00Z",
  },
  {
    id: 8,
    title: "E-commerce Product: Premium Headphones",
    contentTypeId: 2,
    contentType: { id: 2, name: "Product Page", slug: "product-page" },
    status: "ready_for_approval",
    createdBy: 3,
    creator: dummyUsers[2],
    updatedBy: 2,
    updater: dummyUsers[1],
    createdAt: "2024-01-22T09:00:00Z",
    updatedAt: "2024-01-24T14:20:00Z",
  },
  {
    id: 9,
    title: "Marketing Campaign: Holiday Special",
    contentTypeId: 3,
    contentType: { id: 3, name: "Landing Page", slug: "landing-page" },
    status: "ready_for_approval",
    createdBy: 2,
    creator: dummyUsers[1],
    updatedBy: 2,
    updater: dummyUsers[1],
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-24T09:15:00Z",
  },
  {
    id: 10,
    title: "Breaking News: Technology Innovation",
    contentTypeId: 4,
    contentType: { id: 4, name: "News Article", slug: "news-article" },
    status: "ready_for_approval",
    createdBy: 3,
    creator: dummyUsers[2],
    updatedBy: 3,
    updater: dummyUsers[2],
    createdAt: "2024-01-21T08:00:00Z",
    updatedAt: "2024-01-23T16:45:00Z",
  },
];

// Dummy Workflow History
export const dummyHistory: WorkflowHistory[] = [
  {
    id: 1,
    entryId: 2,
    fromStatus: "draft",
    toStatus: "in_review",
    changedBy: 3,
    user: dummyUsers[2],
    comment: "Submitted for review",
    createdAt: "2024-01-21T10:00:00Z",
  },
  {
    id: 2,
    entryId: 3,
    fromStatus: "in_review",
    toStatus: "ready_for_approval",
    changedBy: 2,
    user: dummyUsers[1],
    comment: "Ready for manager approval",
    createdAt: "2024-01-23T14:30:00Z",
  },
  {
    id: 3,
    entryId: 4,
    fromStatus: "ready_for_approval",
    toStatus: "approved",
    changedBy: 5,
    user: dummyUsers[4],
    comment: "Content approved, ready to publish",
    createdAt: "2024-01-24T09:15:00Z",
  },
  {
    id: 4,
    entryId: 5,
    fromStatus: "approved",
    toStatus: "published",
    changedBy: 5,
    user: dummyUsers[4],
    comment: "",
    createdAt: "2024-01-25T09:00:00Z",
  },
  {
    id: 5,
    entryId: 6,
    fromStatus: "in_review",
    toStatus: "rejected",
    changedBy: 5,
    user: dummyUsers[4],
    comment: "Needs more factual information",
    createdAt: "2024-01-21T15:45:00Z",
  },
];

// Dummy Workflow Comments
export const dummyComments: WorkflowComment[] = [
  {
    id: 1,
    entryId: 2,
    userId: 2,
    user: dummyUsers[1],
    comment: "Please review the technical accuracy of this content.",
    isPrivate: false,
    createdAt: "2024-01-21T10:05:00Z",
  },
  {
    id: 2,
    entryId: 2,
    userId: 3,
    user: dummyUsers[2],
    comment: "I've added more examples. Please check again.",
    isPrivate: false,
    createdAt: "2024-01-22T08:30:00Z",
  },
  {
    id: 3,
    entryId: 3,
    userId: 5,
    user: dummyUsers[4],
    comment: "Internal note: This needs legal review before publishing.",
    isPrivate: true,
    createdAt: "2024-01-23T16:00:00Z",
  },
];

// Dummy Workflow Assignments
export const dummyAssignments: WorkflowAssignment[] = [
  {
    id: 1,
    entryId: 2,
    entry: dummyEntries[1],
    assignedTo: 2,
    user: dummyUsers[1],
    assignedBy: 5,
    assigner: dummyUsers[4],
    status: "pending",
    dueDate: "2024-01-30T17:00:00Z",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
  },
  {
    id: 2,
    entryId: 3,
    entry: dummyEntries[2],
    assignedTo: 3,
    user: dummyUsers[2],
    assignedBy: 5,
    assigner: dummyUsers[4],
    status: "completed",
    dueDate: "2024-01-25T17:00:00Z",
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-24T10:00:00Z",
  },
];

// Dummy Workflow Transitions (based on backend seed.go)
export const dummyTransitions: WorkflowTransition[] = [
  { id: 1, fromStatus: "draft", toStatus: "in_review", requiredRole: "editor", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, fromStatus: "draft", toStatus: "in_review", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, fromStatus: "draft", toStatus: "rejected", requiredRole: "editor", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, fromStatus: "draft", toStatus: "rejected", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, fromStatus: "in_review", toStatus: "ready_for_approval", requiredRole: "editor", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  
  { id: 6, fromStatus: "in_review", toStatus: "ready_for_approval", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 7, fromStatus: "in_review", toStatus: "rejected", requiredRole: "editor", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  
  { id: 8, fromStatus: "in_review", toStatus: "rejected", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 9, fromStatus: "in_review", toStatus: "draft", requiredRole: "editor", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  
  { id: 10, fromStatus: "in_review", toStatus: "draft", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 11, fromStatus: "ready_for_approval", toStatus: "approved", requiredRole: "manager", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 12, fromStatus: "ready_for_approval", toStatus: "approved", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 13, fromStatus: "ready_for_approval", toStatus: "rejected", requiredRole: "manager", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 14, fromStatus: "ready_for_approval", toStatus: "rejected", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 15, fromStatus: "approved", toStatus: "published", requiredRole: "manager", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 16, fromStatus: "approved", toStatus: "published", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 17, fromStatus: "rejected", toStatus: "draft", requiredRole: "editor", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 18, fromStatus: "rejected", toStatus: "draft", requiredRole: "admin", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

// Helper Functions
export const getStatusLabel = (status: WorkflowStatus): string => {
  const labels: Record<WorkflowStatus, string> = {
    draft: "Draft",
    in_review: "In Review",
    ready_for_approval: "Ready for Approval",
    approved: "Approved",
    published: "Published",
    rejected: "Rejected",
  };
  return labels[status] || status;
};

export const getStatusColor = (status: WorkflowStatus): string => {
  const colors: Record<WorkflowStatus, string> = {
    draft: "bg-gray-500 text-white",
    in_review: "bg-blue-500 text-white",
    ready_for_approval: "bg-orange-500 text-white",
    approved: "bg-green-500 text-white",
    published: "bg-purple-500 text-white",
    rejected: "bg-red-500 text-white",
  };
  return colors[status] || "bg-gray-500 text-white";
};

export const getAvailableTransitions = (
  currentStatus: WorkflowStatus,
  userRole: string
): WorkflowTransition[] => {
  return dummyTransitions.filter(
    (t) => t.fromStatus === currentStatus && t.requiredRole === userRole
  );
};

export const isValidTransition = (
  fromStatus: WorkflowStatus,
  toStatus: WorkflowStatus,
  userRole: string
): boolean => {
  return dummyTransitions.some(
    (t) =>
      t.fromStatus === fromStatus &&
      t.toStatus === toStatus &&
      t.requiredRole === userRole
  );
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get entries by status
export const getEntriesByStatus = (
  status?: WorkflowStatus
): ContentEntry[] => {
  if (!status) return dummyEntries;
  return dummyEntries.filter((e) => e.status === status);
};

// Get history by entry ID
export const getHistoryByEntryId = (entryId: number): WorkflowHistory[] => {
  return dummyHistory.filter((h) => h.entryId === entryId);
};

// Get comments by entry ID
export const getCommentsByEntryId = (entryId: number): WorkflowComment[] => {
  return dummyComments.filter((c) => c.entryId === entryId);
};

// Get assignments by user ID
export const getAssignmentsByUserId = (
  userId: number
): WorkflowAssignment[] => {
  return dummyAssignments.filter((a) => a.assignedTo === userId);
};

// Get statistics
export const getWorkflowStatistics = (): WorkflowStatistics[] => {
  const statsByContentType: Record<number, WorkflowStatistics> = {};

  dummyEntries.forEach((entry) => {
    if (!statsByContentType[entry.contentTypeId]) {
      statsByContentType[entry.contentTypeId] = {
        contentTypeId: entry.contentTypeId,
        contentType: entry.contentType,
        totalEntries: 0,
        draftCount: 0,
        inReviewCount: 0,
        readyForApprovalCount: 0,
        approvedCount: 0,
        publishedCount: 0,
        rejectedCount: 0,
      };
    }

    const stats = statsByContentType[entry.contentTypeId];
    stats.totalEntries++;

    switch (entry.status) {
      case "draft":
        stats.draftCount++;
        break;
      case "in_review":
        stats.inReviewCount++;
        break;
      case "ready_for_approval":
        stats.readyForApprovalCount++;
        break;
      case "approved":
        stats.approvedCount++;
        break;
      case "published":
        stats.publishedCount++;
        break;
      case "rejected":
        stats.rejectedCount++;
        break;
    }
  });

  return Object.values(statsByContentType);
};

