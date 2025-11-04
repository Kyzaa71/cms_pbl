"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layers, Database, FileText } from "lucide-react";
import { dummyContentTypes } from "@/components/content-builder/types";
import { getEntriesByContentType } from "@/components/content-management/types";
import type { ContentType } from "@/components/content-builder/types";

export default function ContentManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contentTypes] = useState<ContentType[]>(dummyContentTypes);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if type parameter exists in URL, redirect to entries list
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      router.push(`/content-management/${typeParam}`);
    }
  }, [searchParams, router]);

  // Filter content types
  const filteredContentTypes = contentTypes.filter((ct) => {
    const matchesSearch =
      ct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ct.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get entry counts for each content type
  const getEntryCount = (contentTypeId: number) => {
    return getEntriesByContentType(contentTypeId).length;
  };

  const handleSelectContentType = (contentTypeId: number) => {
    router.push(`/content-management/${contentTypeId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Content Management
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Select a content type to manage its entries
          </p>
        </div>
        <Link href="/content-builder">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--card-bg-inner)] border border-[var(--border)] hover:bg-[var(--hover)] transition-colors text-sm font-medium text-[var(--foreground)]">
            <Layers className="w-4 h-4" />
            Content Builder
          </button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search content types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
          />
        </div>
      </Card>

      {/* Content Types Grid */}
      {filteredContentTypes.length === 0 ? (
        <Card className="p-12 text-center border border-[var(--border)] bg-[var(--card-bg-inner)]">
          <p className="text-[var(--muted-foreground)]">
            No content types found. Create your first content type in{" "}
            <Link href="/content-builder" className="text-[var(--primary)] hover:underline">
              Content Builder
            </Link>
            .
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContentTypes.map((contentType) => {
            const entryCount = getEntryCount(contentType.id);
            return (
              <Card
                key={contentType.id}
                className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-pointer hover:shadow-md"
                onClick={() => handleSelectContentType(contentType.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[var(--primary)]/10 rounded-lg">
                      <Layers className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[var(--foreground)]">
                        {contentType.name}
                      </h3>
                      <code className="text-xs text-[var(--muted-foreground)] bg-[var(--card-bg)] px-2 py-1 rounded mt-1 inline-block">
                        {contentType.slug}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <Database className="w-4 h-4" />
                      <span>{contentType.fieldsCount} Fields</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <FileText className="w-4 h-4" />
                      <span>{entryCount} Entries</span>
                    </div>
                  </div>

                  {contentType.enableSeo && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                      <span className="text-xs px-2 py-1 rounded bg-[var(--success)]/10 text-[var(--success)]">
                        SEO Enabled
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <button className="w-full text-left text-sm font-medium text-[var(--primary)] hover:underline">
                    Manage Entries →
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
