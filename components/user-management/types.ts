// Types and dummy data for User Management

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId: number;
  status: "active" | "inactive";
  avatar?: string;
  createdAt: string;
  provider?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

// Dummy Data
export const dummyUsers: User[] = [
  {
    id: 1,
    name: "Alvaro Zeka Ricardo",
    email: "alvaro.ricardo@cmlabs.com",
    role: "Admin",
    roleId: 1,
    status: "active",
    createdAt: "2024-01-15",
    provider: "local",
  },
  {
    id: 2,
    name: "Bayu Yuyu",
    email: "bayu.yuyu@cmlabs.com",
    role: "Editor",
    roleId: 2,
    status: "active",
    createdAt: "2024-02-20",
    provider: "google",
  },
  {
    id: 3,
    name: "Wawan Awan",
    email: "wawan.awan@cmlabs.com",
    role: "Content Writer",
    roleId: 6,
    status: "active",
    createdAt: "2024-03-10",
    provider: "local",
  },
  {
    id: 4,
    name: "Mamat Rahmat",
    email: "mamat.rahmat@cmlabs.com",
    role: "SEO Specialist",
    roleId: 5,
    status: "active",
    createdAt: "2024-04-05",
    provider: "local",
  },
  {
    id: 5,
    name: "Udin Din Din",
    email: "udin.din@cmlabs.com",
    role: "Viewer",
    roleId: 4,
    status: "inactive",
    createdAt: "2024-05-12",
    provider: "google",
  },
  {
    id: 6,
    name: "Sarah Johnson",
    email: "sarah.johnson@cmlabs.com",
    role: "Manager",
    roleId: 3,
    status: "active",
    createdAt: "2024-06-01",
    provider: "local",
  },
];

export const dummyRoles: Role[] = [
  { id: 1, name: "Admin", description: "Full access to all resources" },
  { id: 2, name: "Editor", description: "Can create/edit content, upload media" },
  { id: 3, name: "Manager", description: "Can approve content" },
  { id: 4, name: "Viewer", description: "Can view content only" },
  { id: 5, name: "SEO Specialist", description: "Can edit SEO fields only" },
  { id: 6, name: "Content Writer", description: "Can create/edit content (non-SEO fields)" },
];

// Helper functions
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    Admin: "bg-[var(--primary)] text-[var(--button-text)]",
    Editor: "bg-[var(--secondary)] text-[var(--button-text)]",
    Manager: "bg-purple-600 text-white",
    "Content Writer": "bg-blue-500 text-white",
    "SEO Specialist": "bg-green-600 text-white",
    Viewer: "bg-gray-500 text-white",
  };
  return colors[role] || "bg-gray-500 text-white";
};

