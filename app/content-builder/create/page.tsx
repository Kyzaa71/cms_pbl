"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, X } from "lucide-react";
import { contentActions } from "@/hooks/use-content";

function formatSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CreateContentTypePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [enableSeo, setEnableSeo] = useState(false);

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
    try {
      const created = await contentActions.createContentType({ name, slug });
      try {
        await contentActions.updateContentType((created as any).id, { name, slug, enable_seo: enableSeo });
      } catch {}
      router.push(`/content-builder/${(created as any).id}`);
    } catch (e: any) {
      alert(e?.message || "Failed to create content type");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/content-builder">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Create Content Type
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Step 1: Define name and slug
              </p>
            </div>
          </div>
          <Link href="/content-builder">
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
              Slug digunakan pada API. Harus unik dan huruf kecil.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-md">
            <div>
              <p className="font-medium text-sm text-[var(--foreground)]">
                Enable SEO Fields
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Izinkan entri memiliki metadata SEO (meta title, description, dll.)
              </p>
            </div>
            <Switch checked={enableSeo} onCheckedChange={setEnableSeo} />
          </div>

          
        <div className="flex gap-3 pt-4">
            <Link href="/content-builder" className="flex-1">
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
              Create Type
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
