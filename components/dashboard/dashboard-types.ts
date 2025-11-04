// Dashboard Types and Mock Data

export interface Project {
  id: string;
  name: string;
  type: "personal" | "organizational";
  status: "progress" | "completed" | "on-hold";
  lastUpdate: string;
  deadline?: string;
  progress?: number;
  domain?: string;
  collaborators?: number;
}

export interface ProjectDeadline {
  name: string;
  deadline: string;
  status: "On Track" | "Urgent" | "Pending";
  daysLeft?: number;
}

export interface ProjectDetail {
  name: string;
  description: string;
  progress: number;
}

export interface ContentStats {
  totalEntries: number;
  published: number;
  draft: number;
  pendingApproval: number;
  inReview: number;
  approved: number;
  rejected: number;
}

export interface ApprovalQueueItem {
  id: number;
  title: string;
  contentType: string;
  creator: string;
  submittedAt: string;
  priority: "high" | "medium" | "low";
}

export interface WorkflowStatusBreakdown {
  contentType: string;
  draft: number;
  inReview: number;
  readyForApproval: number;
  approved: number;
  published: number;
  rejected: number;
}

export interface ActivityItem {
  id: string;
  type: "project" | "content" | "workflow" | "media" | "user";
  action: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: string;
  recentUploads: number;
  byType: {
    images: number;
    videos: number;
    documents: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  members: number;
  lastUpdate: string;
}

// Mock Data

export const mockPersonalProjects: Project[] = [
  {
    id: "1",
    name: "CMS CmLabs",
    type: "personal",
    status: "progress",
    lastUpdate: "32 Minutes Ago",
    progress: 85,
    domain: "cms-cmlabs.cms.com",
  },
  {
    id: "2",
    name: "CMS Pegadaian",
    type: "personal",
    status: "progress",
    lastUpdate: "12 Hours Ago",
    progress: 60,
    domain: "cms-pegadaian.cms.com",
  },
  {
    id: "3",
    name: "CMS UB",
    type: "personal",
    status: "completed",
    lastUpdate: "16 Sep 2025, 15.11",
    progress: 100,
    domain: "cms-ub.cms.com",
  },
];

export const mockOrganizationalProjects: Project[] = [
  {
    id: "ORG001",
    name: "CMS Enterprise",
    type: "organizational",
    status: "progress",
    lastUpdate: "2 Hours Ago",
    progress: 70,
    collaborators: 15,
  },
  {
    id: "ORG002",
    name: "CMS Corporate",
    type: "organizational",
    status: "progress",
    lastUpdate: "1 Day Ago",
    progress: 45,
    collaborators: 9,
  },
];

export const mockProjectDeadlines: ProjectDeadline[] = [
  { name: "Website Redesign", deadline: "3 days left", status: "On Track", daysLeft: 3 },
  { name: "Mobile App", deadline: "1 day left", status: "Urgent", daysLeft: 1 },
  { name: "Marketing Campaign", deadline: "5 days left", status: "Pending", daysLeft: 5 },
];

export const mockProjectDetails: ProjectDetail[] = [
  { name: "Website Redesign", description: "UI overhaul for main site", progress: 85 },
  { name: "Mobile App", description: "Feature completion and bug fixes", progress: 60 },
  { name: "Marketing Campaign", description: "Social media and outreach", progress: 40 },
  { name: "Internal Tools", description: "Automation improvements", progress: 20 },
];

export const mockContentStats: ContentStats = {
  totalEntries: 245,
  published: 156,
  draft: 42,
  pendingApproval: 18,
  inReview: 15,
  approved: 12,
  rejected: 2,
};

export const mockApprovalQueueItems: ApprovalQueueItem[] = [
  {
    id: 1,
    title: "New Product Launch Article",
    contentType: "Blog Post",
    creator: "Alvaro Zeka Ricardo",
    submittedAt: "2 hours ago",
    priority: "high",
  },
  {
    id: 2,
    title: "Q4 Marketing Campaign Page",
    contentType: "Landing Page",
    creator: "Bayu Yuyu",
    submittedAt: "5 hours ago",
    priority: "medium",
  },
  {
    id: 3,
    title: "Company News Update",
    contentType: "News Article",
    creator: "Sarah Johnson",
    submittedAt: "1 day ago",
    priority: "low",
  },
];

export const mockWorkflowStatusBreakdown: WorkflowStatusBreakdown[] = [
  {
    contentType: "Blog Post",
    draft: 15,
    inReview: 8,
    readyForApproval: 5,
    approved: 12,
    published: 85,
    rejected: 2,
  },
  {
    contentType: "Product Page",
    draft: 10,
    inReview: 5,
    readyForApproval: 8,
    approved: 20,
    published: 45,
    rejected: 1,
  },
  {
    contentType: "Landing Page",
    draft: 8,
    inReview: 3,
    readyForApproval: 4,
    approved: 15,
    published: 28,
    rejected: 0,
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "content",
    action: "created",
    description: "New Blog Post 'Getting Started with CMS' was created",
    timestamp: "5 minutes ago",
    icon: "FileText",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "2",
    type: "workflow",
    action: "approved",
    description: "Product Page 'New Features 2025' was approved",
    timestamp: "1 hour ago",
    icon: "CheckCircle2",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "3",
    type: "project",
    action: "updated",
    description: "CMS CmLabs project was updated",
    timestamp: "2 hours ago",
    icon: "Settings",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "4",
    type: "media",
    action: "uploaded",
    description: "5 new images uploaded to Media Library",
    timestamp: "3 hours ago",
    icon: "Image",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "5",
    type: "workflow",
    action: "submitted",
    description: "Landing Page 'Summer Campaign' submitted for review",
    timestamp: "5 hours ago",
    icon: "SendToBack",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: "6",
    type: "content",
    action: "published",
    description: "News Article 'Company Milestone' was published",
    timestamp: "1 day ago",
    icon: "Megaphone",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

export const mockMediaStats: MediaStats = {
  totalFiles: 1248,
  totalSize: "2.4 GB",
  recentUploads: 12,
  byType: {
    images: 856,
    videos: 124,
    documents: 268,
  },
};

export const mockOrganizations: Organization[] = [
  { id: "1", name: "Tech Innovators", members: 15, lastUpdate: "1 hour ago" },
  { id: "2", name: "Dev Community", members: 9, lastUpdate: "3 hours ago" },
  { id: "3", name: "Startup Hub", members: 12, lastUpdate: "5 hours ago" },
  { id: "4", name: "Open Source Lab", members: 7, lastUpdate: "1 day ago" },
];



