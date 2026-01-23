"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOPreviewProps, SEOPreviewData } from "./types";
import { generateSEOPreview } from "./seo-preview-helpers";
import { contentService } from "@/lib/services/content-service";
import { SEOPreviewCard } from "./seo-preview-card";
import { SEOPreviewSocial } from "./seo-preview-social";
import { SEOPreviewMetadata } from "./seo-preview-metadata";
import { useSearchParams } from "next/navigation";
import { projectService } from "@/lib/services/project-service";
import { useAuth } from "@/hooks/use-auth";

type TabType = "google" | "facebook" | "twitter" | "linkedin" | "metadata";

export function SEOPreviewModal({
  entryId,
  entry: entryProp,
  contentType: contentTypeProp,
  isOpen,
  onClose,
}: SEOPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("google");
  const [seoData, setSeoData] = useState<SEOPreviewData>({});
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [projectRoleName, setProjectRoleName] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !entryId) return;
    const doLoad = async () => {
      try {
        const apiData = await contentService.seoPreview(entryId);
        setSeoData(apiData as SEOPreviewData);
      } catch {
        const currentEntry = entryProp;
        const preview = currentEntry ? generateSEOPreview(currentEntry, contentTypeProp) : {};
        setSeoData(preview);
      }
    };
    doLoad();
  }, [isOpen, entryId, entryProp, contentTypeProp]);

  useEffect(() => {
    let active = true;
    const pidStr = searchParams.get("project_id");
    const pid = pidStr ? Number(pidStr) : undefined;
    const fetchRole = async () => {
      if (!pid || !user?.id) { setProjectRoleName(""); return; }
      try {
        const members = await projectService.getProjectMembers(pid);
        const me = members.find((m) => m.user_id === user.id);
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    fetchRole();
    return () => { active = false; };
  }, [searchParams, user?.id]);

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: "google", label: "Google" },
    { id: "facebook", label: "Facebook" },
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "metadata", label: "Metadata" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              SEO Preview
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Preview how your content appears in search engines and social media
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-[var(--card-bg)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] px-6 bg-[var(--card-bg-inner)]">
          <div className="flex gap-1 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap relative
                  ${
                    activeTab === tab.id
                      ? "text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--primary)]/5"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] border-b-2 border-transparent"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === "google" && (
            <div className="space-y-4">
              <SEOPreviewCard
                data={{
                  title: seoData.meta_title,
                  description: seoData.meta_description,
                }}
                url={seoData.canonical_url}
              />
            </div>
          )}

          {activeTab === "facebook" && (
            <div className="space-y-4">
              <SEOPreviewSocial
                data={{
                  title: seoData.og_title || seoData.meta_title,
                  description: seoData.og_description || seoData.meta_description,
                  image: seoData.og_image || seoData.meta_image,
                  platform: "facebook",
                }}
                url={seoData.canonical_url}
              />
            </div>
          )}

          {activeTab === "twitter" && (
            <div className="space-y-4">
              <SEOPreviewSocial
                data={{
                  title: seoData.twitter_title || seoData.meta_title,
                  description: seoData.twitter_description || seoData.meta_description,
                  image: seoData.twitter_image || seoData.meta_image,
                  platform: "twitter",
                }}
                url={seoData.canonical_url}
              />
              {seoData.twitter_card && (
                <div className="mt-4 p-3 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    <span className="font-medium">Card Type: </span>
                    <Badge variant="outline">{seoData.twitter_card}</Badge>
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "linkedin" && (
            <div className="space-y-4">
              <SEOPreviewSocial
                data={{
                  title: seoData.og_title || seoData.meta_title,
                  description: seoData.og_description || seoData.meta_description,
                  image: seoData.og_image || seoData.meta_image,
                  platform: "linkedin",
                }}
                url={seoData.canonical_url}
              />
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="space-y-4">
              <SEOPreviewMetadata data={seoData} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)] bg-[var(--card-bg-inner)]">
          <Button
            variant="outline"
            onClick={onClose}
            className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
          >
            Close
          </Button>
          {(() => {
            const key = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
            const canEditSEO = key === "projectadmin";
            return canEditSEO ? (
              <Button
                onClick={() => {
                  console.log("Edit SEO fields");
                  onClose();
                }}
                className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer"
              >
                Edit SEO Fields
              </Button>
            ) : null;
          })()}
        </div>
      </Card>
    </div>
  );
}

