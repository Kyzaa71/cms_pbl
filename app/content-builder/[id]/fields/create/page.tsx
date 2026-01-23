"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { FieldForm } from "@/components/content-builder/field-form";
import { contentActions } from "@/hooks/use-content";
type FieldFormData = {
  name?: string;
  type?: string;
  required?: boolean;
  isSeo?: boolean;
  unique?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  placeholder?: string;
  helpText?: string;
};
import type { AddFieldPayload } from "@/lib/services/content-service";

export default function CreateFieldPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");
  const rawCtId = (params as any).contentTypeId ?? params.id;
  const contentTypeId = parseInt(String(rawCtId));

  const handleSubmit = async (fieldData: FieldFormData) => {
    try {
      const payload: AddFieldPayload = {
        name: String(fieldData.name || ""),
        type: String(fieldData.type || "string"),
        required: !!fieldData.required,
        is_seo: !!fieldData.isSeo,
      };
      if (fieldData.unique !== undefined) payload.unique = !!fieldData.unique;
      if (fieldData.maxLength !== undefined) payload.max_length = Number(fieldData.maxLength);
      if (fieldData.minLength !== undefined) payload.min_length = Number(fieldData.minLength);
      if (fieldData.pattern) payload.pattern = String(fieldData.pattern);
      if (fieldData.minValue !== undefined) payload.min_value = Number(fieldData.minValue);
      if (fieldData.maxValue !== undefined) payload.max_value = Number(fieldData.maxValue);
      if (fieldData.defaultValue) payload.default_value = String(fieldData.defaultValue);
      if (fieldData.placeholder) payload.placeholder = String(fieldData.placeholder);
      if (fieldData.helpText) payload.help_text = String(fieldData.helpText);

      await contentActions.addField(contentTypeId, payload, projectId ? Number(projectId) : undefined);
      if (projectId) {
        router.push(`/organizational/${projectId}/workspace/content-builder/${contentTypeId}?tab=fields`);
      } else {
        router.push(`/content-builder/${contentTypeId}?tab=fields`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg || "Failed to create field");
    }
  };

  const handleCancel = () => {
    if (projectId) {
      router.push(`/organizational/${projectId}/workspace/content-builder/${contentTypeId}?tab=fields`);
    } else {
      router.push(`/content-builder/${contentTypeId}?tab=fields`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={
                projectId
                  ? `/organizational/${projectId}/workspace/content-builder/${contentTypeId}?tab=fields`
                  : `/content-builder/${contentTypeId}?tab=fields`
              }
            >
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Create Field</h2>
              <p className="text-sm text-[var(--muted-foreground)]">Step 2: Tambah field ke content type</p>
            </div>
          </div>
          <Link
            href={
              projectId
                ? `/organizational/${projectId}/workspace/content-builder/${contentTypeId}?tab=fields`
                : `/content-builder/${contentTypeId}?tab=fields`
            }
          >
            <button className="p-2 rounded hover:bg-[var(--hover)] transition-colors">
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </Link>
        </div>

        
        <FieldForm contentTypeId={contentTypeId} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  );
}
