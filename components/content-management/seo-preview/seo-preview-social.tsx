"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Twitter, Linkedin, Image as ImageIcon } from "lucide-react";
import { SocialPreviewProps } from "./types";
import { truncateText, formatURL } from "./seo-preview-helpers";

interface SEOPreviewSocialProps {
  data: SocialPreviewProps;
  url?: string;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
};

const platformColors = {
  facebook: "bg-[#1877f2]",
  twitter: "bg-[#1da1f2]",
  linkedin: "bg-[#0a66c2]",
};

const platformNames = {
  facebook: "Facebook",
  twitter: "Twitter",
  linkedin: "LinkedIn",
};

export function SEOPreviewSocial({ data, url }: SEOPreviewSocialProps) {
  const Icon = platformIcons[data.platform];
  const colorClass = platformColors[data.platform];
  const platformName = platformNames[data.platform];

  const displayUrl = url || formatURL();
  const displayTitle = data.title || "Page Title";
  const displayDescription = truncateText(data.description, 200);
  const displayImage = data.image || "";

  return (
    <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded ${colorClass} text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          {platformName} Preview
        </h3>
      </div>

      <div className="space-y-4">
        {/* Social Media Card Preview */}
        <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-white max-w-md">
          {/* Image */}
          {displayImage ? (
            <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
              <img
                src={displayImage}
                alt={displayTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No image</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 space-y-2">
            <div className="text-xs text-[#606770] uppercase tracking-wide">
              {displayUrl}
            </div>
            <h4 className="text-base font-semibold text-gray-900 line-clamp-2">
              {displayTitle}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {displayDescription || (
                <span className="italic text-gray-400">
                  No description provided
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 border-t border-[var(--border)] space-y-2 text-xs">
          <div>
            <span className="text-[var(--muted-foreground)]">Image: </span>
            <Badge variant={displayImage ? "default" : "outline"}>
              {displayImage ? "Present" : "Missing"}
            </Badge>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Title: </span>
            <span className={displayTitle.length > 60 ? "text-[var(--danger)]" : "text-[var(--foreground)]"}>
              {displayTitle.length} characters
            </span>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Description: </span>
            <span className={displayDescription.length > 200 ? "text-[var(--danger)]" : "text-[var(--foreground)]"}>
              {displayDescription.length} characters
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

