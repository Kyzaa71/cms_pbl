// Types for SEO Preview feature

import { ContentEntry } from "@/components/content-management/types";
import { ContentType } from "@/components/content-builder/types";

export interface SEOPreviewData {
  meta_title?: string;
  meta_description?: string;
  meta_image?: string;
  slug?: string;
  seo_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_card?: string;
  canonical_url?: string;
  [key: string]: any; // For other SEO fields
}

export interface SEOPreviewProps {
  entryId: number;
  contentTypeId: number;
  entry?: ContentEntry;
  contentType?: ContentType;
  isOpen: boolean;
  onClose: () => void;
}

export interface GooglePreviewProps {
  title?: string;
  url?: string;
  description?: string;
}

export interface SocialPreviewProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  platform: "facebook" | "twitter" | "linkedin";
}

