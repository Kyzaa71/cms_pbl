// Types and dummy data for Role & Permissions

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id?: number;
  roleId?: number;
  module: "ContentEntry" | "Media" | "SEO";
  action: "create" | "read" | "update" | "delete" | "approve";
  fieldScope?: "all" | "seo_only" | "non_seo_only" | "custom";
  allowedFields?: string[];
  deniedFields?: string[];
  contentTypeIds?: number[];
}

// Available modules and actions (based on backend)
export const MODULES = ["ContentEntry", "Media", "SEO"] as const;
export const ACTIONS = ["create", "read", "update", "delete", "approve"] as const;
export const FIELD_SCOPES = ["all", "seo_only", "non_seo_only", "custom"] as const;

// Dummy Content Types (for ContentTypeIDs restriction)
export const dummyContentTypes = [
  { id: 1, name: "Blog Post", slug: "blog-post" },
  { id: 2, name: "Product Page", slug: "product-page" },
  { id: 3, name: "Landing Page", slug: "landing-page" },
];

// Dummy Roles (based on backend seed.go)
export const dummyRoles: Role[] = [
  {
    id: 1,
    name: "admin",
    description: "Full access to all resources",
    permissions: [
      { module: "ContentEntry", action: "create", fieldScope: "all" },
      { module: "ContentEntry", action: "read", fieldScope: "all" },
      { module: "ContentEntry", action: "update", fieldScope: "all" },
      { module: "ContentEntry", action: "delete" },
      { module: "ContentEntry", action: "approve" },
      { module: "Media", action: "create" },
      { module: "Media", action: "read" },
      { module: "Media", action: "update" },
      { module: "Media", action: "delete" },
      { module: "SEO", action: "create", fieldScope: "all" },
      { module: "SEO", action: "read", fieldScope: "all" },
      { module: "SEO", action: "update", fieldScope: "all" },
      { module: "SEO", action: "delete" },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    name: "editor",
    description: "Can create/edit content, upload media, and view SEO",
    permissions: [
      { module: "ContentEntry", action: "create", fieldScope: "all" },
      { module: "ContentEntry", action: "read", fieldScope: "all" },
      { module: "ContentEntry", action: "update", fieldScope: "all" },
      { module: "Media", action: "create" },
      { module: "Media", action: "read" },
      { module: "Media", action: "update" },
      { module: "SEO", action: "read", fieldScope: "all" },
    ],
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: 3,
    name: "manager",
    description: "Can approve content",
    permissions: [
      { module: "ContentEntry", action: "approve" },
      { module: "ContentEntry", action: "read", fieldScope: "all" },
      { module: "Media", action: "read" },
      { module: "SEO", action: "read", fieldScope: "all" },
    ],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
  {
    id: 4,
    name: "viewer",
    description: "Can view content only",
    permissions: [
      { module: "ContentEntry", action: "read", fieldScope: "all" },
      { module: "Media", action: "read" },
      { module: "SEO", action: "read", fieldScope: "all" },
    ],
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04",
  },
  {
    id: 5,
    name: "seo_specialist",
    description: "Can edit SEO fields only",
    permissions: [
      { module: "ContentEntry", action: "read", fieldScope: "all" },
      { module: "ContentEntry", action: "update", fieldScope: "seo_only" },
      { module: "Media", action: "read" },
      { module: "SEO", action: "create", fieldScope: "all" },
      { module: "SEO", action: "read", fieldScope: "all" },
      { module: "SEO", action: "update", fieldScope: "all" },
    ],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
  {
    id: 6,
    name: "content_writer",
    description: "Can create/edit content (non-SEO fields)",
    permissions: [
      { module: "ContentEntry", action: "create", fieldScope: "non_seo_only" },
      { module: "ContentEntry", action: "read", fieldScope: "all" },
      { module: "ContentEntry", action: "update", fieldScope: "non_seo_only" },
      { module: "Media", action: "create" },
      { module: "Media", action: "read" },
    ],
    createdAt: "2024-01-06",
    updatedAt: "2024-01-06",
  },
];

// Dummy users data (untuk count users per role)
const dummyUsers = [
  { id: 1, roleId: 1 }, // admin
  { id: 2, roleId: 2 }, // editor
  { id: 3, roleId: 2 }, // editor
  { id: 4, roleId: 3 }, // manager
  { id: 5, roleId: 4 }, // viewer
  { id: 6, roleId: 5 }, // seo_specialist
];

// Helper Functions
export const getPermissionLabel = (module: string, action: string): string => {
  const moduleLabels: Record<string, string> = {
    ContentEntry: "Content Entry",
    Media: "Media",
    SEO: "SEO",
  };

  const actionLabels: Record<string, string> = {
    create: "Create",
    read: "Read",
    update: "Update",
    delete: "Delete",
    approve: "Approve",
  };

  return `${moduleLabels[module] || module} - ${actionLabels[action] || action}`;
};

export const getFieldScopeLabel = (scope?: string): string => {
  const labels: Record<string, string> = {
    all: "All Fields",
    seo_only: "SEO Fields Only",
    non_seo_only: "Non-SEO Fields Only",
    custom: "Custom Fields",
  };
  return labels[scope || "all"] || "All Fields";
};

export const countPermissions = (role: Role): number => {
  return role.permissions?.length || 0;
};

export const countUsersWithRole = (roleId: number): number => {
  return dummyUsers.filter((u) => u.roleId === roleId).length;
};

export const formatRoleName = (name: string): string => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const hasPermission = (
  role: Role,
  module: Permission["module"],
  action: Permission["action"]
): boolean => {
  return role.permissions?.some(
    (p) => p.module === module && p.action === action
  ) || false;
};

export const getPermission = (
  role: Role,
  module: Permission["module"],
  action: Permission["action"]
): Permission | undefined => {
  return role.permissions?.find(
    (p) => p.module === module && p.action === action
  );
};

export const getAvailableActions = (module: Permission["module"]): Permission["action"][] => {
  // Approve only for ContentEntry
  if (module === "ContentEntry") {
    return ["create", "read", "update", "delete", "approve"];
  }
  return ["create", "read", "update", "delete"];
};

