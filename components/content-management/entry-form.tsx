"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import {
  getContentTypeById,
  getFieldsByContentTypeId,
} from "@/components/content-builder/types";
import {
  getEntryById,
  getStatusBadgeColor,
  getStatusLabel,
  type ContentEntry,
  type WorkflowStatus,
} from "@/components/content-management/types";
import { DynamicFieldRenderer } from "./dynamic-field-renderer";

interface EntryFormProps {
  contentTypeId: number;
  entryId?: number;
  onSubmit: (data: Record<string, any>, status: WorkflowStatus) => void;
  onCancel: () => void;
}

export function EntryForm({ contentTypeId, entryId, onSubmit, onCancel }: EntryFormProps) {
  const [contentType, setContentType] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  // Status is always "draft" for new entries, or preserved from existing entry for edits (but not editable)
  const [status] = useState<WorkflowStatus>(entryId ? "draft" : "draft");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const ct = getContentTypeById(contentTypeId);
    setContentType(ct);

    if (contentTypeId) {
      const fieldsData = getFieldsByContentTypeId(contentTypeId);
      setFields(fieldsData);

      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      fieldsData.forEach((field) => {
        if (field.defaultValue) {
          initialData[field.name] = field.defaultValue;
        }
      });
      setFormData(initialData);
    }
  }, [contentTypeId]);

  useEffect(() => {
    if (entryId) {
      const entry = getEntryById(entryId);
      if (entry) {
        setFormData(entry.data || {});
        // Status is preserved from entry but not editable in Content Management
        // Users must use Workflow Management to change status
      }
    }
  }, [entryId]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.name} is required`;
      }

      if (formData[field.name]) {
        const fieldValue = formData[field.name];

        // Validate text length (for string/text/email/url types)
        if (field.type === "string" || field.type === "text" || field.type === "email" || field.type === "url") {
          const stringValue = String(fieldValue);
          if (field.maxLength && stringValue.length > field.maxLength) {
            newErrors[field.name] = `Maximum length is ${field.maxLength} characters`;
          }
          if (field.minLength && stringValue.length < field.minLength) {
            newErrors[field.name] = `Minimum length is ${field.minLength} characters`;
          }

          // Validate email format
          if (field.type === "email" && stringValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(stringValue)) {
              newErrors[field.name] = "Invalid email format";
            }
          }

          // Validate URL format
          if (field.type === "url" && stringValue) {
            try {
              new URL(stringValue);
            } catch {
              newErrors[field.name] = "Invalid URL format";
            }
          }

          // Validate pattern
          if (field.pattern) {
            const regex = new RegExp(field.pattern);
            if (!regex.test(stringValue)) {
              newErrors[field.name] = `Invalid format`;
            }
          }
        }

        // Validate number range
        if (field.type === "number") {
          const numValue = Number(fieldValue);
          if (isNaN(numValue)) {
            newErrors[field.name] = "Must be a valid number";
          } else {
            if (field.maxValue !== undefined && numValue > field.maxValue) {
              newErrors[field.name] = `Maximum value is ${field.maxValue}`;
            }
            if (field.minValue !== undefined && numValue < field.minValue) {
              newErrors[field.name] = `Minimum value is ${field.minValue}`;
            }
          }
        }

        // Validate date format
        if (field.type === "date" && fieldValue) {
          const dateValue = new Date(fieldValue);
          if (isNaN(dateValue.getTime())) {
            newErrors[field.name] = "Invalid date format";
          }
        }

        // Validate media (must have id or url)
        if (field.type === "media" && fieldValue) {
          if (typeof fieldValue === "object" && !fieldValue.id && !fieldValue.url) {
            newErrors[field.name] = "Please select a valid media file";
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format media fields for backend
    // Backend expects: {fieldName} = url, {fieldName}_media_id = id
    const formattedData: Record<string, any> = { ...formData };

    fields.forEach((field) => {
      if (field.type === "media" && formData[field.name]) {
        const mediaValue = formData[field.name];
        // If media value is an object with id and url
        if (typeof mediaValue === "object" && mediaValue !== null) {
          formattedData[field.name] = mediaValue.url || ""; // Store URL in main field
          formattedData[`${field.name}_media_id`] = mediaValue.id || mediaValue.media_id; // Store ID separately
        } else if (typeof mediaValue === "number") {
          // If only ID is provided, we need to fetch the URL (for now, store as is)
          formattedData[`${field.name}_media_id`] = mediaValue;
          formattedData[field.name] = ""; // URL will be fetched by backend
        } else if (typeof mediaValue === "string") {
          // If only URL is provided
          formattedData[field.name] = mediaValue;
        }
      }
    });

    // For new entries, status is always "draft"
    // For existing entries, preserve the existing status (from entryId lookup)
    const entryStatus: WorkflowStatus = entryId 
      ? (() => {
          const entry = getEntryById(entryId);
          return entry ? entry.status : "draft";
        })()
      : "draft";

    onSubmit(formattedData, entryStatus);
  };

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[var(--muted-foreground)]">Loading content type...</p>
      </div>
    );
  }

  const regularFields = fields.filter((f) => !f.isSeo);
  const seoFields = fields.filter((f) => f.isSeo);

  // Get current entry status if editing
  const currentEntry = entryId ? getEntryById(entryId) : null;
  const currentStatus = currentEntry ? currentEntry.status : "draft";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Info (Read-only) */}
      {entryId && (
        <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-[var(--foreground)] mb-1 block">
                Current Status
              </Label>
              <p className="text-sm text-[var(--muted-foreground)]">
                Status cannot be changed here. Use{" "}
                <Link 
                  href={`/workflow-management/${entryId}`}
                  className="text-[var(--primary)] hover:underline"
                >
                  Workflow Management
                </Link>{" "}
                to change status.
              </p>
            </div>
            <Badge className={`${getStatusBadgeColor(currentStatus)} border-none`}>
              {getStatusLabel(currentStatus)}
            </Badge>
          </div>
        </Card>
      )}

      {/* Info for new entries */}
      {!entryId && (
        <Card className="p-4 bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-[var(--foreground)]">
            <span className="font-medium">New entries are created as Draft.</span>{" "}
            Use Workflow Management to change status after creating.
          </p>
        </Card>
      )}

      {/* Regular Fields */}
      {regularFields.length > 0 && (
        <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Content Fields
          </h3>
          <div className="space-y-4">
            {regularFields.map((field) => (
              <DynamicFieldRenderer
                key={field.id}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
              />
            ))}
          </div>
        </Card>
      )}

      {/* SEO Fields */}
      {seoFields.length > 0 && contentType.enableSeo && (
        <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            SEO Fields
          </h3>
          <div className="space-y-4">
            {seoFields.map((field) => (
              <DynamicFieldRenderer
                key={field.id}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 !font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
        >
          {entryId ? "Update Entry" : "Create Entry"}
        </Button>
      </div>
    </form>
  );
}

