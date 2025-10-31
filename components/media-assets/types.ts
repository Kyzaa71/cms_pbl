// Types and dummy data for Media Assets

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface MediaFile {
  id: number;
  file_name: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  folder: string;
  tags?: string[];
  alt: string;
  caption?: string;
  uploaded_by: number;
  uploader?: User;
  created_at: string;
  updated_at: string;
}

export interface MediaFolder {
  id: number;
  name: string;
  path: string;
  parent_id?: number;
  parent?: MediaFolder;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface MediaStats {
  total_files: number;
  total_size_bytes: number;
  by_type: { [key: string]: number };
  recent_uploads_24h: number;
  storage_mode: string;
}

// Dummy Users
export const dummyUsers: User[] = [
  { id: 1, name: "Alvaro Zeka Ricardo", email: "alvaro.ricardo@cmlabs.com" },
  { id: 2, name: "Bayu Yuyu", email: "bayu.yuyu@cmlabs.com" },
  { id: 3, name: "Wawan Awan", email: "wawan.awan@cmlabs.com" },
  { id: 4, name: "Mamat Rahmat", email: "mamat.rahmat@cmlabs.com" },
];

// Dummy Folders
export const dummyFolders: MediaFolder[] = [
  {
    id: 1,
    name: "products",
    path: "/products",
    parent_id: undefined,
    created_by: 1,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
  },
  {
    id: 2,
    name: "marketing",
    path: "/marketing",
    parent_id: undefined,
    created_by: 1,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
  },
  {
    id: 3,
    name: "hero-images",
    path: "/products/hero-images",
    parent_id: 1,
    created_by: 2,
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-01-15T09:00:00Z",
  },
  {
    id: 4,
    name: "banners",
    path: "/marketing/banners",
    parent_id: 2,
    created_by: 2,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
];

// Dummy Media Files
export const dummyMediaFiles: MediaFile[] = [
  {
    id: 1,
    file_name: "product-hero.jpg",
    url: "https://via.placeholder.com/1920x1080",
    type: "image/jpeg",
    size: 245678,
    width: 1920,
    height: 1080,
    folder: "/products",
    tags: ["hero", "product", "marketing"],
    alt: "Product hero image",
    caption: "Main product showcase image for homepage",
    uploaded_by: 1,
    uploader: dummyUsers[0],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    file_name: "product-detail.png",
    url: "https://via.placeholder.com/800x600",
    type: "image/png",
    size: 185432,
    width: 800,
    height: 600,
    folder: "/products/hero-images",
    tags: ["product", "detail"],
    alt: "Product detail view",
    caption: "Detailed product image",
    uploaded_by: 2,
    uploader: dummyUsers[1],
    created_at: "2024-01-16T11:30:00Z",
    updated_at: "2024-01-16T11:30:00Z",
  },
  {
    id: 3,
    file_name: "marketing-banner.jpg",
    url: "https://via.placeholder.com/1200x400",
    type: "image/jpeg",
    size: 324567,
    width: 1200,
    height: 400,
    folder: "/marketing/banners",
    tags: ["banner", "marketing", "promotion"],
    alt: "Marketing banner",
    caption: "Promotional banner for homepage",
    uploaded_by: 2,
    uploader: dummyUsers[1],
    created_at: "2024-01-18T14:20:00Z",
    updated_at: "2024-01-18T14:20:00Z",
  },
  {
    id: 4,
    file_name: "product-video.mp4",
    url: "https://example.com/videos/product-video.mp4",
    type: "video/mp4",
    size: 5242880,
    folder: "/products",
    tags: ["video", "product", "demo"],
    alt: "Product demonstration video",
    caption: "Video showcasing product features",
    uploaded_by: 3,
    uploader: dummyUsers[2],
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-01-20T09:15:00Z",
  },
  {
    id: 5,
    file_name: "logo.svg",
    url: "https://via.placeholder.com/200x200",
    type: "image/svg+xml",
    size: 4567,
    width: 200,
    height: 200,
    folder: "/marketing",
    tags: ["logo", "brand"],
    alt: "Company logo",
    caption: "Main company logo",
    uploaded_by: 1,
    uploader: dummyUsers[0],
    created_at: "2024-01-12T08:00:00Z",
    updated_at: "2024-01-12T08:00:00Z",
  },
  {
    id: 6,
    file_name: "user-guide.pdf",
    url: "https://example.com/files/user-guide.pdf",
    type: "application/pdf",
    size: 1024000,
    folder: "/marketing",
    tags: ["document", "guide"],
    alt: "User guide document",
    caption: "Product user guide",
    uploaded_by: 4,
    uploader: dummyUsers[3],
    created_at: "2024-01-22T13:45:00Z",
    updated_at: "2024-01-22T13:45:00Z",
  },
  {
    id: 7,
    file_name: "gallery-image-1.jpg",
    url: "https://via.placeholder.com/1024x768",
    type: "image/jpeg",
    size: 456789,
    width: 1024,
    height: 768,
    folder: "/products",
    tags: ["gallery", "product"],
    alt: "Gallery image 1",
    caption: "",
    uploaded_by: 2,
    uploader: dummyUsers[1],
    created_at: "2024-01-23T16:30:00Z",
    updated_at: "2024-01-23T16:30:00Z",
  },
  {
    id: 8,
    file_name: "gallery-image-2.jpg",
    url: "https://via.placeholder.com/1024x768",
    type: "image/jpeg",
    size: 478912,
    width: 1024,
    height: 768,
    folder: "/products",
    tags: ["gallery", "product"],
    alt: "Gallery image 2",
    caption: "",
    uploaded_by: 2,
    uploader: dummyUsers[1],
    created_at: "2024-01-23T16:32:00Z",
    updated_at: "2024-01-23T16:32:00Z",
  },
];

// Helper Functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const getMediaTypeCategory = (
  type: string
): "image" | "video" | "document" | "other" => {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("application/") || type.includes("pdf") || type.includes("document"))
    return "document";
  return "other";
};

export const getFileIcon = (type: string): string => {
  const category = getMediaTypeCategory(type);
  switch (category) {
    case "image":
      return "🖼️";
    case "video":
      return "🎥";
    case "document":
      return "📄";
    default:
      return "📎";
  }
};

export const filterMediaByType = (
  media: MediaFile[],
  type: string
): MediaFile[] => {
  if (!type || type === "all") return media;
  if (type === "image") {
    return media.filter((m) => m.type.startsWith("image/"));
  }
  if (type === "video") {
    return media.filter((m) => m.type.startsWith("video/"));
  }
  if (type === "document") {
    return media.filter(
      (m) =>
        m.type.startsWith("application/") ||
        m.type.includes("pdf") ||
        m.type.includes("document")
    );
  }
  return media.filter((m) => m.type.includes(type));
};

export const filterMediaByFolder = (
  media: MediaFile[],
  folder: string
): MediaFile[] => {
  if (!folder || folder === "all") return media;
  return media.filter((m) => m.folder === folder);
};

export const searchMedia = (media: MediaFile[], query: string): MediaFile[] => {
  if (!query.trim()) return media;
  const lowerQuery = query.toLowerCase();
  return media.filter(
    (m) =>
      m.file_name.toLowerCase().includes(lowerQuery) ||
      m.alt.toLowerCase().includes(lowerQuery) ||
      (m.caption && m.caption.toLowerCase().includes(lowerQuery)) ||
      m.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const calculateStats = (media: MediaFile[]): MediaStats => {
  const stats: MediaStats = {
    total_files: media.length,
    total_size_bytes: media.reduce((sum, m) => sum + m.size, 0),
    by_type: {},
    recent_uploads_24h: 0,
    storage_mode: "local",
  };

  // Calculate by type
  media.forEach((m) => {
    const category = getMediaTypeCategory(m.type);
    stats.by_type[category] = (stats.by_type[category] || 0) + 1;
  });

  // Calculate recent uploads (last 24 hours)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  stats.recent_uploads_24h = media.filter((m) => {
    const created = new Date(m.created_at);
    return created >= yesterday;
  }).length;

  return stats;
};

export const getMediaById = (id: number): MediaFile | undefined => {
  return dummyMediaFiles.find((m) => m.id === id);
};

export const getMediaByFolder = (folderPath: string): MediaFile[] => {
  return dummyMediaFiles.filter((m) => m.folder === folderPath);
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

export const buildFolderTree = (
  folders: MediaFolder[]
): MediaFolder[] => {
  const folderMap = new Map<number, MediaFolder & { children?: MediaFolder[] }>();
  const rootFolders: (MediaFolder & { children?: MediaFolder[] })[] = [];

  // Create map
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // Build tree
  folders.forEach((folder) => {
    const folderWithChildren = folderMap.get(folder.id)!;
    if (folder.parent_id) {
      const parent = folderMap.get(folder.parent_id);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(folderWithChildren);
      }
    } else {
      rootFolders.push(folderWithChildren);
    }
  });

  return rootFolders;
};

