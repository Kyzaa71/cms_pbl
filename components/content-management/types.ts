// Types and dummy data for Content Management (Content Entries)

import { ContentType, getContentTypeById, getFieldsByContentTypeId } from "@/components/content-builder/types";

export type WorkflowStatus = 
  | "draft" 
  | "in_review" 
  | "ready_for_approval" 
  | "approved" 
  | "published" 
  | "rejected";

export interface ContentEntry {
  id: number;
  contentTypeId: number;
  contentType?: ContentType;
  data: Record<string, any>; // Dynamic data based on fields
  status: WorkflowStatus;
  createdBy: number;
  updatedBy?: number;
  creator?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  updater?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Helper function to get display title from entry data
export const getEntryTitle = (entry: ContentEntry): string => {
  const contentType = getContentTypeById(entry.contentTypeId);
  if (!contentType) return `Entry #${entry.id}`;
  
  const fields = getFieldsByContentTypeId(entry.contentTypeId);
  // Try to find a title field or use the first string field
  const titleField = fields.find(f => 
    f.name.toLowerCase().includes('title') || 
    f.name.toLowerCase().includes('name') ||
    (f.type === 'string' && f.isSeo === false)
  );
  
  if (titleField && entry.data[titleField.name]) {
    return String(entry.data[titleField.name]);
  }
  
  return `${contentType.name} #${entry.id}`;
};

// Helper function to get entries by content type
export const getEntriesByContentType = (contentTypeId: number): ContentEntry[] => {
  return dummyEntries.filter(e => e.contentTypeId === contentTypeId);
};

// Helper function to get entries by status
export const getEntriesByStatus = (status: WorkflowStatus): ContentEntry[] => {
  return dummyEntries.filter(e => e.status === status);
};

// Dummy Users
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
];

// Dummy Entries
export const dummyEntries: ContentEntry[] = [
  // Article entries
  {
    id: 1,
    contentTypeId: 1,
    data: {
      title: "Getting Started with Next.js",
      body: "This is a comprehensive guide to getting started with Next.js framework...",
      featured_image: "/images/article1.jpg",
      meta_title: "Getting Started with Next.js - Tutorial",
      meta_description: "Learn how to build modern web applications with Next.js",
      tags: ["tutorial", "nextjs", "react", "web-development", "javascript"],
    },
    status: "published",
    createdBy: 1,
    updatedBy: 1,
    creator: dummyUsers[0],
    updater: dummyUsers[0],
    createdAt: "2024-10-15",
    updatedAt: "2024-10-16",
    publishedAt: "2024-10-16",
  },
  {
    id: 2,
    contentTypeId: 1,
    data: {
      title: "React Hooks Best Practices",
      body: "Explore the best practices for using React Hooks in your applications...",
      featured_image: "/images/article2.jpg",
      meta_title: "React Hooks Best Practices Guide",
      meta_description: "Master React Hooks with these proven best practices",
      tags: ["react", "hooks", "best-practices", "javascript", "frontend"],
    },
    status: "draft",
    createdBy: 2,
    creator: dummyUsers[1],
    createdAt: "2024-10-18",
    updatedAt: "2024-10-18",
  },
  {
    id: 3,
    contentTypeId: 1,
    data: {
      title: "TypeScript for Beginners",
      body: "A beginner-friendly introduction to TypeScript programming language...",
      featured_image: "/images/article3.jpg",
      meta_title: "TypeScript for Beginners - Complete Guide",
      meta_description: "Start your TypeScript journey with this comprehensive guide",
      tags: ["typescript", "tutorial", "beginner", "programming", "javascript"],
    },
    status: "in_review",
    createdBy: 2,
    updatedBy: 3,
    creator: dummyUsers[1],
    updater: dummyUsers[2],
    createdAt: "2024-10-10",
    updatedAt: "2024-10-19",
  },
  {
    id: 4,
    contentTypeId: 1,
    data: {
      title: "CSS Grid Layout Tutorial",
      body: "Learn how to create modern layouts using CSS Grid...",
      featured_image: "/images/article4.jpg",
      tags: ["css", "grid", "layout", "tutorial", "web-design"],
    },
    status: "approved",
    createdBy: 3,
    creator: dummyUsers[2],
    createdAt: "2024-10-12",
    updatedAt: "2024-10-17",
  },
  // Product entries
  {
    id: 5,
    contentTypeId: 2,
    data: {
      name: "Premium Wireless Headphones",
      price: 199.99,
      description: "High-quality wireless headphones with noise cancellation",
      image: "/images/product1.jpg",
      in_stock: true,
      meta_title: "Premium Wireless Headphones - Best Buy",
      meta_description: "Experience premium sound quality with our wireless headphones",
      slug: "premium-wireless-headphones",
      tags: ["electronics", "audio", "wireless", "premium", "headphones"],
    },
    status: "published",
    createdBy: 1,
    updatedBy: 1,
    creator: dummyUsers[0],
    updater: dummyUsers[0],
    createdAt: "2024-09-20",
    updatedAt: "2024-09-22",
    publishedAt: "2024-09-22",
  },
  {
    id: 6,
    contentTypeId: 2,
    data: {
      name: "Smart Watch Pro",
      price: 299.99,
      description: "Feature-rich smartwatch with health tracking",
      image: "/images/product2.jpg",
      in_stock: true,
      meta_title: "Smart Watch Pro - Advanced Features",
      meta_description: "Stay connected and track your health with Smart Watch Pro",
      slug: "smart-watch-pro",
      tags: ["electronics", "wearables", "smartwatch", "health", "fitness"],
    },
    status: "draft",
    createdBy: 2,
    creator: dummyUsers[1],
    createdAt: "2024-10-15",
    updatedAt: "2024-10-15",
  },
  {
    id: 7,
    contentTypeId: 2,
    data: {
      name: "Laptop Stand Ergonomic",
      price: 49.99,
      description: "Adjustable laptop stand for better ergonomics",
      image: "/images/product3.jpg",
      in_stock: false,
      slug: "laptop-stand-ergonomic",
      tags: ["accessories", "ergonomics", "laptop", "office", "productivity"],
    },
    status: "published",
    createdBy: 3,
    creator: dummyUsers[2],
    createdAt: "2024-10-01",
    updatedAt: "2024-10-05",
    publishedAt: "2024-10-05",
  },
  // Page entries
  {
    id: 8,
    contentTypeId: 3,
    data: {
      title: "About Us",
      content: "Learn more about our company and our mission to provide the best solutions...",
      meta_title: "About Us - Our Story",
      meta_description: "Discover our company history, values, and mission",
      tags: ["company", "about", "information", "business"],
    },
    status: "published",
    createdBy: 1,
    creator: dummyUsers[0],
    createdAt: "2024-08-10",
    updatedAt: "2024-08-10",
    publishedAt: "2024-08-10",
  },
  {
    id: 9,
    contentTypeId: 3,
    data: {
      title: "Contact",
      content: "Get in touch with us through various channels...",
      meta_title: "Contact Us - Get in Touch",
      meta_description: "Reach out to our team for any inquiries or support",
      tags: ["contact", "support", "information", "business"],
    },
    status: "published",
    createdBy: 1,
    creator: dummyUsers[0],
    createdAt: "2024-08-11",
    updatedAt: "2024-08-11",
    publishedAt: "2024-08-11",
  },
  // Category entries
  {
    id: 10,
    contentTypeId: 4,
    data: {
      name: "Electronics",
      description: "All electronic products and gadgets",
      icon: "/images/category1.jpg",
      tags: ["electronics", "tech", "gadgets", "products"],
    },
    status: "published",
    createdBy: 1,
    creator: dummyUsers[0],
    createdAt: "2024-07-15",
    updatedAt: "2024-07-15",
    publishedAt: "2024-07-15",
  },
  {
    id: 11,
    contentTypeId: 4,
    data: {
      name: "Clothing",
      description: "Fashion and apparel items",
      icon: "/images/category2.jpg",
      tags: ["clothing", "fashion", "apparel", "products"],
    },
    status: "published",
    createdBy: 1,
    creator: dummyUsers[0],
    createdAt: "2024-07-16",
    updatedAt: "2024-07-16",
    publishedAt: "2024-07-16",
  },
  // Testimonial entries
  {
    id: 12,
    contentTypeId: 5,
    data: {
      author_name: "John Doe",
      author_role: "CEO, Tech Corp",
      testimonial_text: "This product has completely transformed our workflow. Highly recommended!",
      author_photo: "/images/testimonial1.jpg",
      tags: ["testimonial", "review", "customer", "feedback"],
    },
    status: "published",
    createdBy: 1,
    creator: dummyUsers[0],
    createdAt: "2024-09-01",
    updatedAt: "2024-09-01",
    publishedAt: "2024-09-01",
  },
];

// Get entry by ID
export const getEntryById = (id: number): ContentEntry | undefined => {
  return dummyEntries.find(e => e.id === id);
};

// Format date helper
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

// Get status badge color
export const getStatusBadgeColor = (status: WorkflowStatus): string => {
  const colors: Record<WorkflowStatus, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    in_review: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ready_for_approval: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    published: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || colors.draft;
};

// Get status label
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

