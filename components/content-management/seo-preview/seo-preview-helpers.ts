// Helper functions for SEO Preview

import { ContentEntry } from "@/components/content-management/types";
import { ContentType } from "@/components/content-builder/types";
import { SEOPreviewData } from "./types";

/**
 * Generate SEO preview data from entry data
 * Extracts all SEO-related fields (fields starting with "seo_", "meta_", etc.)
 */
export function generateSEOPreview(
  entry: ContentEntry,
  contentType?: ContentType
): SEOPreviewData {
  if (!entry || !entry.data) {
    return {};
  }

  const data = entry.data;
  const seoData: SEOPreviewData = {};

  // Extract SEO fields - check for common patterns
  Object.keys(data).forEach((key) => {
    const lowerKey = key.toLowerCase();
    
    // Extract fields that are SEO-related
    if (
      lowerKey.startsWith("seo_") ||
      lowerKey.startsWith("meta_") ||
      lowerKey === "slug" ||
      lowerKey === "canonical_url" ||
      lowerKey.includes("og_") ||
      lowerKey.includes("twitter_")
    ) {
      seoData[key] = data[key];
    }
  });

  // Set defaults if missing
  if (!seoData.meta_title && data.title) {
    seoData.meta_title = String(data.title);
  }
  
  if (!seoData.meta_description && data.description) {
    seoData.meta_description = String(data.description).substring(0, 160);
  }

  // Generate URL from slug
  if (seoData.slug && !seoData.canonical_url) {
    const baseURL = typeof window !== "undefined" 
      ? window.location.origin 
      : "https://example.com";
    seoData.canonical_url = `${baseURL}/${seoData.slug}`;
  }

  // Set OG defaults from meta fields
  if (!seoData.og_title && seoData.meta_title) {
    seoData.og_title = seoData.meta_title;
  }
  
  if (!seoData.og_description && seoData.meta_description) {
    seoData.og_description = seoData.meta_description;
  }
  
  if (!seoData.og_image && seoData.meta_image) {
    seoData.og_image = seoData.meta_image;
  }

  // Set Twitter defaults
  if (!seoData.twitter_title && seoData.meta_title) {
    seoData.twitter_title = seoData.meta_title;
  }
  
  if (!seoData.twitter_description && seoData.meta_description) {
    seoData.twitter_description = seoData.meta_description;
  }
  
  if (!seoData.twitter_image && seoData.meta_image) {
    seoData.twitter_image = seoData.meta_image;
  }
  
  if (!seoData.twitter_card) {
    seoData.twitter_card = "summary_large_image";
  }

  return seoData;
}

/**
 * Format URL for display
 */
export function formatURL(slug?: string, baseURL?: string): string {
  if (!slug) return "https://example.com/";
  
  const base = baseURL || (typeof window !== "undefined" ? window.location.origin : "https://example.com");
  return `${base}/${slug}`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string | undefined, maxLength: number = 160): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Validate SEO data completeness
 */
export function validateSEOData(seoData: SEOPreviewData): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!seoData.meta_title || seoData.meta_title.length === 0) {
    warnings.push("Meta title is missing");
  } else if (seoData.meta_title.length < 30) {
    warnings.push("Meta title is too short (recommended: 50-60 characters)");
  } else if (seoData.meta_title.length > 60) {
    warnings.push("Meta title is too long (may be truncated in search results)");
  }

  if (!seoData.meta_description || seoData.meta_description.length === 0) {
    warnings.push("Meta description is missing");
  } else if (seoData.meta_description.length < 120) {
    warnings.push("Meta description is too short (recommended: 150-160 characters)");
  } else if (seoData.meta_description.length > 160) {
    warnings.push("Meta description is too long (may be truncated in search results)");
  }

  if (!seoData.meta_image) {
    warnings.push("Meta image is missing (recommended for better social sharing)");
  }

  if (!seoData.slug) {
    warnings.push("Slug is missing (needed for URL generation)");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

