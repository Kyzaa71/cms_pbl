"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, X } from "lucide-react";
import {
  getContentTypeById,
  ContentType,
  formatSlug,
} from "@/components/content-builder/types";

export default function EditContentTypePage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeId = parseInt(params.id as string);

  const [contentType, setContentType] = useState<ContentType | undefined>();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [enableSeo, setEnableSeo] = useState(false);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(false);

  useEffect(() => {
    const ct = getContentTypeById(contentTypeId);
    if (ct) {
      setContentType(ct);
      setName(ct.name);
      setSlug(ct.slug);
      setEnableSeo(ct.enableSeo);
    }
  }, [contentTypeId]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (autoGenerateSlug) {
      setSlug(formatSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("Name and slug are required");
      return;
    }

    // In a real app, this would call: PUT /content/types/:id
    console.log("Update content type:", {
      id: contentTypeId,
      name,
      slug,
      enable_seo: enableSeo,
    });

    router.push(`/content-builder/${contentTypeId}`);
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/content-builder/${contentTypeId}`}>
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
          <Link href={`/content-builder/${contentTypeId}`}>
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        {/* Form */}
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
            <Link href={`/content-builder/${contentTypeId}`} className="flex-1">
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
      </Card>
    </div>
  );
}

