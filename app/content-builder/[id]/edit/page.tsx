"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, X } from "lucide-react";
import { ContentType } from "@/types/backend-models";
import { useContentType, contentActions } from "@/hooks/use-content";
import { useAuth } from "@/hooks/use-auth";
import { projectService } from "@/lib/services/project-service";

function formatSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EditContentTypePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const rawCtId = (params as any).contentTypeId ?? params.id;
  const contentTypeId = parseInt(String(rawCtId));
  const projectId = searchParams.get("project_id");
  const { data: fetchedCT } = useContentType(contentTypeId);
  const [contentType, setContentType] = useState<ContentType | undefined>();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [enableSeo, setEnableSeo] = useState(false);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(false);
  const [projectRoleName, setProjectRoleName] = useState<string>("");

  useEffect(() => {
    if (fetchedCT) {
      setContentType(fetchedCT);
      setName(fetchedCT.name);
      setSlug(fetchedCT.slug);
      setEnableSeo(!!fetchedCT.enable_seo);
    }
  }, [fetchedCT]);

  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!projectId || !user?.id) {
        setProjectRoleName("");
        return;
      }
      try {
        const members = await projectService.getProjectMembers(Number(projectId));
        const me = members.find((m) => m.user_id === user.id);
        const rn = (me?.role?.name || "").trim();
        if (active) setProjectRoleName(rn);
      } catch {
        if (active) setProjectRoleName("");
      }
    };
    fetchRole();
    return () => { active = false; };
  }, [projectId, user?.id]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (autoGenerateSlug) {
      setSlug(formatSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      alert("Name and slug are required");
      return;
    }
    await contentActions.updateContentType(contentTypeId, { name, slug, enable_seo: enableSeo });
    if (projectId) {
      router.push(`/organizational/${projectId}/workspace/content-builder/${contentTypeId}?project_id=${projectId}`);
    } else {
      router.push(`/content-builder/${contentTypeId}`);
    }
  };

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-builder">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const roleName = (user?.role?.name || "").toLowerCase();
  const projectRoleKey = (projectRoleName || "").toLowerCase().replace(/[\s_-]+/g, "");
  const canEdit = projectId ? (projectRoleKey === "projectadmin") : (roleName === "admin");

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={
                projectId
                  ? `/organizational/${projectId}/workspace/content-builder/${contentTypeId}?project_id=${projectId}`
                  : `/content-builder/${contentTypeId}`
              }
            >
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Edit Content Type
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Update content type configuration
              </p>
            </div>
          </div>
          <Link
            href={
              projectId
                ? `/organizational/${projectId}/workspace/content-builder/${contentTypeId}?project_id=${projectId}`
                : `/content-builder/${contentTypeId}`
            }
          >
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        {/* Form */}
        {!canEdit ? (
          <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] text-sm text-[var(--muted-foreground)]">
            no permission
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Content Type Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              API Slug *
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setAutoGenerateSlug(false);
                }}
                className="border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
                required
              />
              <Switch
                checked={autoGenerateSlug}
                onCheckedChange={setAutoGenerateSlug}
              />
              <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">Auto</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Changing the slug may break existing API integrations
            </p>
          </div>

          {/* SEO Toggle */}
          <div className="flex items-center justify-between p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
            <div>
              <p className="font-medium text-sm text-[var(--foreground)]">
                Enable SEO Fields
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Allow entries to have SEO metadata (meta title, description, etc.)
              </p>
            </div>
            <Switch checked={enableSeo} onCheckedChange={setEnableSeo} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              href={
                projectId
                  ? `/organizational/${projectId}/workspace/content-builder/${contentTypeId}?project_id=${projectId}`
                  : `/content-builder/${contentTypeId}`
              }
              className="flex-1"
            >
              <Button 
                type="button" 
                variant="outline" 
                className="w-full !font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
        )}
      </Card>
    </div>
  );
}

