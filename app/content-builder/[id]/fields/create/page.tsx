"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";
import {
  getContentTypeById,
} from "@/components/content-builder/types";
import { FieldForm } from "@/components/content-builder/field-form";
import type { ContentField } from "@/components/content-builder/types";

export default function CreateFieldPage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeId = parseInt(params.id as string);

  const contentType = getContentTypeById(contentTypeId);

  const handleSubmit = (fieldData: Partial<ContentField>) => {
    // In a real app, this would call: POST /content/types/:content_type_id/fields
    console.log("Create field:", {
      contentTypeId,
      fieldData,
    });

    // Redirect back to detail page with fields tab active
    router.push(`/content-builder/${contentTypeId}?tab=fields`);
  };

  const handleCancel = () => {
    router.push(`/content-builder/${contentTypeId}?tab=fields`);
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
            <Link href={`/content-builder/${contentTypeId}?tab=fields`}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Add New Field
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Create a new field for {contentType.name} content type
              </p>
            </div>
          </div>
          <Link href={`/content-builder/${contentTypeId}?tab=fields`}>
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        {/* Field Form */}
        <FieldForm
          field={null}
          contentTypeId={contentTypeId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}

