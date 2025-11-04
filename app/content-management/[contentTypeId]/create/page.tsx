"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";
import { getContentTypeById } from "@/components/content-builder/types";
import { EntryForm } from "@/components/content-management/entry-form";
import type { WorkflowStatus } from "@/components/content-management/types";

export default function CreateEntryPage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeId = parseInt(params.contentTypeId as string);

  const contentType = getContentTypeById(contentTypeId);

  const handleSubmit = (data: Record<string, any>, status: WorkflowStatus) => {
    // In a real app, this would call: POST /content/:content_type_id/entries
    console.log("Create entry:", {
      contentTypeId,
      data,
      status,
    });

    // Redirect to entries list
    router.push(`/content-management/${contentTypeId}`);
  };

  const handleCancel = () => {
    router.push(`/content-management/${contentTypeId}`);
  };

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-management">
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
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/content-management/${contentTypeId}`}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Create New {contentType.name} Entry
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Fill in the fields below to create a new entry
              </p>
            </div>
          </div>
          <Link href={`/content-management/${contentTypeId}`}>
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        {/* Form */}
        <EntryForm
          contentTypeId={contentTypeId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}

