"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import {
  getContentTypeById,
  getFieldsByContentTypeId,
  ContentType,
  ContentField,
} from "@/components/content-builder/types";
import { ValidationViewer } from "@/components/content-builder/field-validation/validation-viewer";
import { generateValidationRules } from "@/components/content-builder/field-validation/validation-helpers";

export default function FieldValidationPage() {
  const params = useParams();
  const router = useRouter();
  const rawCtId = (params as any).contentTypeId ?? params.id;
  const contentTypeId = parseInt(String(rawCtId));
  const fieldId = parseInt(params.fieldId as string);

  const [contentType, setContentType] = useState<ContentType | undefined>();
  const [field, setField] = useState<ContentField | undefined>();
  const [validationRules, setValidationRules] = useState<any>(null);

  useEffect(() => {
    const ct = getContentTypeById(contentTypeId);
    setContentType(ct);

    if (ct) {
      const fields = getFieldsByContentTypeId(contentTypeId);
      const foundField = fields.find((f) => f.id === fieldId);
      setField(foundField);

      if (foundField) {
        // In a real app, this would fetch from: GET /content/fields/:field_id/validation
        const rules = generateValidationRules(foundField);
        setValidationRules(rules);
      }
    }
  }, [contentTypeId, fieldId]);

  if (!contentType || !field || !validationRules) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-lg font-medium text-[var(--foreground)] mb-2">
            Loading validation rules...
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {!field && "Field not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/content-builder/${contentTypeId}?tab=fields`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--card-bg)]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Validation Rules
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Rules and constraints for field: <span className="font-medium text-[var(--foreground)]">{field.name}</span> in <span className="font-medium text-[var(--foreground)]">{contentType.name}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/content-builder/${contentTypeId}?tab=fields`}>
            <Button
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-orange-500 hover:!bg-orange-600 active:!bg-orange-700 !text-white !border-orange-500 hover:!border-orange-600 !cursor-pointer flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit Field
            </Button>
          </Link>
        </div>
      </div>

      {/* Validation Rules Viewer */}
      <ValidationViewer rules={validationRules} />
    </div>
  );
}

