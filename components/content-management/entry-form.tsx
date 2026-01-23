"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
// import { ArrowLeft } from "lucide-react";
import { getStatusBadgeColor, getStatusLabel, type WorkflowStatus } from "@/components/content-management/types";
import { useContentType } from "@/hooks/use-content";
import { contentService } from "@/lib/services/content-service";
import { DynamicFieldRenderer } from "./dynamic-field-renderer";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { projectService } from "@/lib/services/project-service";
import type { ContentType as BackendContentType, ContentField as BackendContentField, ContentEntry as BackendContentEntry, Permission } from "@/types/backend-models";

interface EntryFormProps {
  contentTypeId: number;
  entryId?: number;
  projectId?: number;
  onSubmit: (data: Record<string, unknown>, status: WorkflowStatus) => void;
  onCancel: () => void;
}

export function EntryForm({ contentTypeId, entryId, projectId, onSubmit, onCancel }: EntryFormProps) {
  const { data: fetchedCT } = useContentType(contentTypeId, projectId);
  const { user, can } = useAuth();
  const roleName = (() => {
    // 1. Try from user object
    if (user?.role?.name) return user.role.name;
    
    // 2. Try from token
    const token = api.getToken();
    if (!token) return "";
    try {
      const part = token.split(".")[1] || "";
      const json = JSON.parse(atob(part));
      
      // Handle string role
      if (typeof json?.role === "string") return json.role;
      // Handle array of roles
       const rawRoles = json?.role;
       if (Array.isArray(rawRoles)) {
         const roles = rawRoles.map((r) => {
           if (typeof r === "string") return r;
           if (r && typeof r === "object" && "name" in (r as Record<string, unknown>)) {
             const n = (r as { name?: unknown }).name;
             return typeof n === "string" ? n : "";
           }
           return "";
         });
         if (roles.some((r) => r.toLowerCase().replace(/[\s_-]+/g, "") === "projectadmin")) return "projectadmin";
        return roles[0] || "";
      }
      // Handle object role with name
      if (json?.role?.name && typeof json.role.name === "string") return json.role.name;
      
      return "";
    } catch {
      return "";
    }
  })();
  
  const roleKey = (roleName || "").toLowerCase().replace(/[\s_-]+/g, "").trim();
  const [isProjectAdminMembership, setIsProjectAdminMembership] = useState<boolean>(false);
  const isProjectAdmin = roleKey === "projectadmin" || isProjectAdminMembership;
  const [contentType, setContentType] = useState<BackendContentType | null>(null);
  interface EntryField {
    id: number;
    contentTypeId: number;
    name: string;
    type: string;
    required: boolean;
    isSeo: boolean;
    unique: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    minValue?: number;
    maxValue?: number;
    defaultValue?: string;
    placeholder?: string;
    helpText?: string;
  }
  const [fields, setFields] = useState<EntryField[]>([]);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  // Status is always "draft" for new entries, or preserved from existing entry for edits (but not editable)
  // const [status] = useState<WorkflowStatus>(entryId ? "draft" : "draft");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fetchedCT) {
      setContentType(fetchedCT as BackendContentType);
      const merged = [
        ...((fetchedCT as BackendContentType).fields || []),
        ...((fetchedCT as BackendContentType).seo_fields || []),
      ].map((f: BackendContentField) => ({
        id: f.id,
        contentTypeId: f.content_type_id,
        name: f.name,
        type: f.type,
        required: f.required,
        isSeo: !!f.is_seo,
        unique: f.unique,
        maxLength: f.max_length,
        minLength: f.min_length,
        pattern: f.pattern,
        minValue: f.min_value,
        maxValue: f.max_value,
        defaultValue: f.default_value,
        placeholder: f.placeholder,
        helpText: f.help_text,
      })) as EntryField[];
      setFields(merged);
      const initialData: Record<string, unknown> = {};
      merged.forEach((field: EntryField) => {
        if (field.defaultValue) initialData[field.name] = field.defaultValue;
      });
      setFormData((prev) => (entryId ? { ...initialData, ...prev } : initialData));
    }
  }, [fetchedCT, entryId]);

  const [currentEntry, setCurrentEntry] = useState<BackendContentEntry | null>(null);
  useEffect(() => {
    if (entryId) {
      contentService.getEntry(entryId).then((entry) => {
        setCurrentEntry(entry as BackendContentEntry);
        const d = (entry as BackendContentEntry).data;
        const safe = d && typeof d === "object" ? (d as Record<string, unknown>) : {};
        setFormData(safe);
      });
    }
  }, [entryId]);

  useEffect(() => {
    let cancelled = false;
    async function checkProjectRole() {
      try {
        if (!projectId || !user?.id) return;
        const members = await projectService.getProjectMembers(projectId);
        const me = members.find((m) => m.user_id === user.id);
        const nameRaw =
          (me?.role?.name as string | undefined) ||
          (typeof me?.role === "string" ? (me?.role as string) : undefined);
        const key = (nameRaw || "").toLowerCase().replace(/[\s_-]+/g, "").trim();
        if (!cancelled) setIsProjectAdminMembership(key === "projectadmin");
      } catch {
        if (!cancelled) setIsProjectAdminMembership(false);
      }
    }
    checkProjectRole();
    return () => {
      cancelled = true;
    };
  }, [projectId, user?.id]);

  const handleFieldChange = (fieldName: string, value: unknown) => {
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

    const isEditable = (field: EntryField): boolean => {
      if (isProjectAdmin) return true;
      const action: "create" | "update" = entryId ? "update" : "create";
      if (!can("ContentEntry", action)) return false;
      const perms: Permission[] = Array.isArray(user?.role?.permissions) ? user!.role!.permissions : [];
      const p = perms.find((x) => x.module === "ContentEntry" && x.action === action);
      const scope = (p?.field_scope as string) || "all";
      const allowedRaw = p?.allowed_fields;
      const deniedRaw = p?.denied_fields;
      const allowed = Array.isArray(allowedRaw) ? (allowedRaw as string[]) : undefined;
      const denied = Array.isArray(deniedRaw) ? (deniedRaw as string[]) : undefined;
      if (scope === "all") return true;
      if (scope === "seo_only") return !!field.isSeo;
      if (scope === "non_seo_only") return !field.isSeo;
      if (scope === "custom") {
        if (allowed && allowed.length > 0) return allowed.includes(field.name);
        if (denied && denied.length > 0) return !denied.includes(field.name);
        return false;
      }
      return false;
    };

    fields.forEach((field: EntryField) => {
      const editable = isEditable(field);
      if (!editable) return;
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.name} is required`;
      }

      if (formData[field.name]) {
        const fieldValue = formData[field.name];

        // Validate text length (for string/text/email/url types)
        if (field.type === "string" || field.type === "text" || field.type === "email" || field.type === "url") {
          const stringValue = String(fieldValue as string);
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
              new URL(stringValue as string);
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
          const numValue = Number(fieldValue as number);
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
          const dateValue = new Date(fieldValue as string | number | Date);
          if (isNaN(dateValue.getTime())) {
            newErrors[field.name] = "Invalid date format";
          }
        }

        // Validate media (must have id or url)
        if (field.type === "media" && fieldValue) {
          if (typeof fieldValue === "object" && fieldValue !== null && !("id" in (fieldValue as Record<string, unknown>)) && !("url" in (fieldValue as Record<string, unknown>))) {
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

    // Ensure at least one field provided
    const hasData = Object.keys(formData).length > 0 && Object.values(formData).some((v) => v !== undefined && v !== null && String(v as unknown as string).length > 0);
    if (!hasData) {
      alert("Please fill at least one field before creating the entry");
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Hanya kirim field yang diizinkan oleh content type
    const formattedData: Record<string, unknown> = {};
    fields.forEach((field: EntryField) => {
      const val = formData[field.name];
      if (val === undefined) return;
      if (field.type === "media" && val) {
        if (typeof val === "object" && val !== null) {
          const obj = val as { url?: string; id?: number; media_id?: number };
          formattedData[field.name] = obj.url || "";
          formattedData[`${field.name}_media_id`] = obj.id ?? obj.media_id;
        } else if (typeof val === "number") {
          formattedData[`${field.name}_media_id`] = val;
          formattedData[field.name] = "";
        } else if (typeof val === "string") {
          formattedData[field.name] = val;
        }
      } else {
        formattedData[field.name] = val;
      }
    });
    // Buang key asing yang mungkin berasal dari entry lama

    // For new entries, status is always "draft"
    // For existing entries, preserve the existing status (from entryId lookup)
    const entryStatus: WorkflowStatus = entryId
      ? ((currentEntry?.status as WorkflowStatus) || "draft")
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
  const currentStatus = "draft";
  const canSubmit = isProjectAdmin ? true : (entryId ? can("ContentEntry", "update") : can("ContentEntry", "create"));
  const actionScope = (() => {
    const action: "create" | "update" = entryId ? "update" : "create";
    const perms: Permission[] = Array.isArray(user?.role?.permissions) ? (user!.role!.permissions as Permission[]) : [];
    const p = perms.find((x: Permission) => x.module === "ContentEntry" && x.action === action);
    return (p?.field_scope as string) || "all";
  })();
  const hasRequiredSeo = fields.filter((f) => f.isSeo).some((f) => !!f.required);
  const blockedBySeoRequirement = isProjectAdmin ? false : (!entryId && actionScope === "non_seo_only" && hasRequiredSeo);
  const isEditableField = (field: EntryField): boolean => {
    if (isProjectAdmin) return true;
    const action: "create" | "update" = entryId ? "update" : "create";
    if (!can("ContentEntry", action)) return false;
    const perms: Permission[] = Array.isArray(user?.role?.permissions) ? (user!.role!.permissions as Permission[]) : [];
    const p = perms.find((x: Permission) => x.module === "ContentEntry" && x.action === action);
    const scope = (p?.field_scope as string) || "all";
    const allowedRaw = p?.allowed_fields;
    const deniedRaw = p?.denied_fields;
    const allowed = Array.isArray(allowedRaw) ? (allowedRaw as string[]) : undefined;
    const denied = Array.isArray(deniedRaw) ? (deniedRaw as string[]) : undefined;
    if (scope === "all") return true;
    if (scope === "seo_only") return !!field.isSeo;
    if (scope === "non_seo_only") return !field.isSeo;
    if (scope === "custom") {
      if (allowed && allowed.length > 0) return allowed.includes(field.name);
      if (denied && denied.length > 0) return !denied.includes(field.name);
      return false;
    }
    return false;
  };

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
                disabled={!isEditableField(field)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* SEO Fields */}
      {seoFields.length > 0 && contentType.enable_seo && (
        <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            SEO Fields
          </h3>
          {blockedBySeoRequirement && (
            <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 text-sm border border-yellow-300">
              Some required SEO fields exist. Your role cannot edit SEO fields. Please ask an editor/manager to complete them or mark them optional.
            </div>
          )}
          <div className="space-y-4">
            {seoFields.map((field) => (
              <DynamicFieldRenderer
                key={field.id}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                disabled={!isEditableField(field)}
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
          disabled={!canSubmit || blockedBySeoRequirement}
        >
          {entryId ? "Update Entry" : "Create Entry"}
        </Button>
      </div>
    </form>
  );
}
