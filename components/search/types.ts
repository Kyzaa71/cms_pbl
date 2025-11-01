// Types and dummy data for Search Module

export interface ContentType {
  id: number;
  name: string;
  slug: string;
}

export interface ContentEntry {
  id: number;
  contentTypeId: number;
  contentType: ContentType;
  status: WorkflowStatus;
  title: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  data: Record<string, any>;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  updater?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type WorkflowStatus = 
  | "draft" 
  | "in_review" 
  | "ready_for_approval" 
  | "approved" 
  | "published" 
  | "rejected";

export interface SearchParams {
  query: string;
  content_type_ids?: number[];
  fields?: string[];
  status?: WorkflowStatus | "";
  tags?: string[];
  created_by?: number;
  from_date?: string;
  to_date?: string;
  sort_by?: "created_at" | "updated_at" | "published_at" | "title";
  order_by?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SearchFacets {
  content_types: Record<string, number>;
  statuses: Record<string, number>;
  date_range: {
    oldest: string;
    newest: string;
  };
}

export interface SearchResult {
  entries: ContentEntry[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  query: string;
  facets?: SearchFacets;
}

// Dummy Content Types
export const dummyContentTypes: ContentType[] = [
  { id: 1, name: "Blog Post", slug: "blog-post" },
  { id: 2, name: "Product", slug: "product" },
  { id: 3, name: "Page", slug: "page" },
  { id: 4, name: "Author", slug: "author" },
  { id: 5, name: "Category", slug: "category" },
];

// Dummy Users for creator/updater
export const dummyUsers = [
  { id: 1, name: "Alvaro Ricardo", email: "alvaro@cmlabs.com" },
  { id: 2, name: "Bayu Yuyu", email: "bayu@cmlabs.com" },
  { id: 3, name: "Sarah Johnson", email: "sarah@cmlabs.com" },
  { id: 4, name: "John Doe", email: "john@cmlabs.com" },
];

// Dummy Content Entries (diverse samples for search)
export const dummyEntries: ContentEntry[] = [
  {
    id: 1,
    contentTypeId: 1,
    contentType: dummyContentTypes[0],
    status: "published",
    title: "Getting Started with React Tutorial",
    description: "A comprehensive guide to React for beginners",
    excerpt: "Learn React from scratch with this detailed tutorial covering hooks, components, and state management...",
    tags: ["react", "javascript", "tutorial", "frontend"],
    data: {
      title: "Getting Started with React Tutorial",
      content: "React is a popular JavaScript library for building user interfaces...",
      author: "John Doe",
      category: "Tutorials",
    },
    creator: dummyUsers[0],
    updater: dummyUsers[1],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    publishedAt: "2024-01-16T15:00:00Z",
  },
  {
    id: 2,
    contentTypeId: 2,
    contentType: dummyContentTypes[1],
    status: "published",
    title: "MacBook Pro 16-inch",
    description: "Latest MacBook Pro with M3 chip",
    excerpt: "Powerful laptop for professionals with stunning display and exceptional performance...",
    tags: ["laptop", "apple", "tech", "computers"],
    data: {
      title: "MacBook Pro 16-inch",
      price: 2499,
      brand: "Apple",
      category: "Laptops",
      in_stock: true,
    },
    creator: dummyUsers[1],
    updater: dummyUsers[1],
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2024-02-10T09:00:00Z",
    publishedAt: "2024-02-11T10:00:00Z",
  },
  {
    id: 3,
    contentTypeId: 1,
    contentType: dummyContentTypes[0],
    status: "draft",
    title: "Advanced React Patterns and Best Practices",
    description: "Deep dive into advanced React patterns",
    excerpt: "Explore advanced patterns like render props, HOCs, custom hooks, and performance optimization...",
    tags: ["react", "patterns", "advanced", "best-practices"],
    data: {
      title: "Advanced React Patterns and Best Practices",
      content: "In this article, we'll explore advanced React patterns...",
      author: "Sarah Johnson",
      category: "Advanced",
    },
    creator: dummyUsers[2],
    updater: dummyUsers[2],
    createdAt: "2024-03-05T11:00:00Z",
    updatedAt: "2024-03-06T16:00:00Z",
  },
  {
    id: 4,
    contentTypeId: 3,
    contentType: dummyContentTypes[2],
    status: "published",
    title: "About Us",
    description: "Learn more about our company",
    excerpt: "We are a leading technology company dedicated to innovation and excellence...",
    tags: ["company", "about"],
    data: {
      title: "About Us",
      content: "Our company was founded in 2020...",
    },
    creator: dummyUsers[0],
    updater: dummyUsers[0],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
    publishedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 5,
    contentTypeId: 2,
    contentType: dummyContentTypes[1],
    status: "published",
    title: "Dell XPS 15",
    description: "Premium laptop with OLED display",
    excerpt: "High-performance laptop for creators with stunning visuals and powerful specs...",
    tags: ["laptop", "dell", "tech", "computers"],
    data: {
      title: "Dell XPS 15",
      price: 1899,
      brand: "Dell",
      category: "Laptops",
      in_stock: true,
    },
    creator: dummyUsers[1],
    updater: dummyUsers[1],
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    publishedAt: "2024-02-16T09:00:00Z",
  },
  {
    id: 6,
    contentTypeId: 1,
    contentType: dummyContentTypes[0],
    status: "in_review",
    title: "Vue.js vs React: A Complete Comparison",
    description: "Compare Vue.js and React frameworks",
    excerpt: "Both Vue.js and React are popular frameworks, but which one should you choose? Let's compare...",
    tags: ["vue", "react", "comparison", "javascript"],
    data: {
      title: "Vue.js vs React: A Complete Comparison",
      content: "In this comparison, we'll look at both frameworks...",
      author: "John Doe",
      category: "Comparison",
    },
    creator: dummyUsers[3],
    updater: dummyUsers[3],
    createdAt: "2024-03-20T13:00:00Z",
    updatedAt: "2024-03-21T10:00:00Z",
  },
  {
    id: 7,
    contentTypeId: 2,
    contentType: dummyContentTypes[1],
    status: "published",
    title: "iPhone 15 Pro Max",
    description: "Latest iPhone with titanium design",
    excerpt: "Premium smartphone with advanced features, ProRAW, and incredible camera system...",
    tags: ["phone", "apple", "tech", "mobile"],
    data: {
      title: "iPhone 15 Pro Max",
      price: 1199,
      brand: "Apple",
      category: "Phones",
      in_stock: true,
    },
    creator: dummyUsers[1],
    updater: dummyUsers[1],
    createdAt: "2024-02-20T11:00:00Z",
    updatedAt: "2024-02-20T11:00:00Z",
    publishedAt: "2024-02-21T08:00:00Z",
  },
  {
    id: 8,
    contentTypeId: 1,
    contentType: dummyContentTypes[0],
    status: "published",
    title: "Node.js Backend Development Guide",
    description: "Complete guide to Node.js backend development",
    excerpt: "Learn how to build scalable backends with Node.js, Express, and modern JavaScript...",
    tags: ["nodejs", "backend", "tutorial", "javascript"],
    data: {
      title: "Node.js Backend Development Guide",
      content: "Node.js is a powerful runtime for building servers...",
      author: "Sarah Johnson",
      category: "Tutorials",
    },
    creator: dummyUsers[2],
    updater: dummyUsers[2],
    createdAt: "2024-02-25T09:00:00Z",
    updatedAt: "2024-02-26T15:00:00Z",
    publishedAt: "2024-02-27T10:00:00Z",
  },
  {
    id: 9,
    contentTypeId: 1,
    contentType: dummyContentTypes[0],
    status: "approved",
    title: "TypeScript Essentials for JavaScript Developers",
    description: "Master TypeScript from JavaScript perspective",
    excerpt: "Transition smoothly from JavaScript to TypeScript with this comprehensive guide...",
    tags: ["typescript", "javascript", "tutorial", "programming"],
    data: {
      title: "TypeScript Essentials for JavaScript Developers",
      content: "TypeScript brings type safety to JavaScript...",
      author: "Alvaro Ricardo",
      category: "Tutorials",
    },
    creator: dummyUsers[0],
    updater: dummyUsers[0],
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-03-11T14:00:00Z",
  },
  {
    id: 10,
    contentTypeId: 2,
    contentType: dummyContentTypes[1],
    status: "published",
    title: "Samsung Galaxy S24 Ultra",
    description: "Flagship Android smartphone with AI features",
    excerpt: "Next-generation smartphone with advanced AI capabilities and stunning camera...",
    tags: ["phone", "samsung", "tech", "mobile"],
    data: {
      title: "Samsung Galaxy S24 Ultra",
      price: 1299,
      brand: "Samsung",
      category: "Phones",
      in_stock: true,
    },
    creator: dummyUsers[1],
    updater: dummyUsers[1],
    createdAt: "2024-02-22T10:00:00Z",
    updatedAt: "2024-02-22T10:00:00Z",
    publishedAt: "2024-02-23T09:00:00Z",
  },
];

// Search functions
export function searchEntries(
  entries: ContentEntry[],
  params: SearchParams
): SearchResult {
  let filtered = [...entries];

  // Text search
  if (params.query) {
    const queryLower = params.query.toLowerCase();
    filtered = filtered.filter((entry) => {
      const titleMatch = entry.title.toLowerCase().includes(queryLower);
      const descMatch = entry.description?.toLowerCase().includes(queryLower);
      const excerptMatch = entry.excerpt?.toLowerCase().includes(queryLower);
      const contentMatch = JSON.stringify(entry.data)
        .toLowerCase()
        .includes(queryLower);
      return titleMatch || descMatch || excerptMatch || contentMatch;
    });
  }

  // Content Type filter
  if (params.content_type_ids && params.content_type_ids.length > 0) {
    filtered = filtered.filter((entry) =>
      params.content_type_ids!.includes(entry.contentTypeId)
    );
  }

  // Status filter
  if (params.status) {
    filtered = filtered.filter((entry) => entry.status === params.status);
  }

  // Tags filter
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter((entry) =>
      params.tags!.some((tag) => entry.tags?.includes(tag))
    );
  }

  // Creator filter
  if (params.created_by) {
    filtered = filtered.filter((entry) => entry.creator.id === params.created_by);
  }

  // Date range filter
  if (params.from_date) {
    const fromDate = new Date(params.from_date);
    filtered = filtered.filter(
      (entry) => new Date(entry.createdAt) >= fromDate
    );
  }
  if (params.to_date) {
    const toDate = new Date(params.to_date);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((entry) => new Date(entry.createdAt) <= toDate);
  }

  // Sorting
  const sortBy = params.sort_by || "created_at";
  const orderBy = params.order_by || "desc";

  filtered.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortBy) {
      case "title":
        aVal = a.title;
        bVal = b.title;
        break;
      case "updated_at":
        aVal = new Date(a.updatedAt);
        bVal = new Date(b.updatedAt);
        break;
      case "published_at":
        aVal = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
        bVal = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
        break;
      default:
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
    }

    if (orderBy === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEntries = filtered.slice(startIndex, endIndex);

  return {
    entries: paginatedEntries,
    total,
    page,
    limit,
    total_pages: totalPages,
    query: params.query || "",
  };
}

// Get facets
export function getSearchFacets(
  entries: ContentEntry[]
): SearchFacets {
  const contentTypes: Record<string, number> = {};
  const statuses: Record<string, number> = {};
  let oldest: Date | null = null;
  let newest: Date | null = null;

  entries.forEach((entry) => {
    // Content Types
    const typeName = entry.contentType.name;
    contentTypes[typeName] = (contentTypes[typeName] || 0) + 1;

    // Statuses
    statuses[entry.status] = (statuses[entry.status] || 0) + 1;

    // Dates
    const createdDate = new Date(entry.createdAt);
    if (oldest === null || createdDate < oldest) {
      oldest = createdDate;
    }
    if (newest === null || createdDate > newest) {
      newest = createdDate;
    }
  });

  const oldestStr = oldest !== null ? (oldest as Date).toISOString().split("T")[0] : "";
  const newestStr = newest !== null ? (newest as Date).toISOString().split("T")[0] : "";

  return {
    content_types: contentTypes,
    statuses: statuses,
    date_range: {
      oldest: oldestStr,
      newest: newestStr,
    },
  };
}

// Helper functions
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusBadgeColor(status: WorkflowStatus): string {
  const colors: Record<WorkflowStatus, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-none",
    in_review: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none",
    ready_for_approval: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none",
    published: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none",
  };
  return colors[status] || "";
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-900'>$1</mark>");
}

