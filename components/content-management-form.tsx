"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { contentService } from "@/lib/services/content-service";
import { mediaService } from "@/lib/services/media-service";
import { ContentType, ContentField } from "@/types/backend-models";

/**
 * Content Management Form
 * 
 * This form creates entries based on fields defined in a content type.
 * 
 * Flow:
 * 1. User selects/opens a content type
 * 2. Form fetches the content type and its fields via GET /content/types/{id}
 * 3. Form renders DYNAMIC input fields based on field definitions
 * 4. User fills in field values
 * 5. Form sends data DIRECTLY (not wrapped in { data: {...} })
 *    Example payload: { "title": "...", "body": "...", "featured_image_media_id": 123 }
 * 6. Backend creates entry and returns entry object
 */
export default function ContentManagementForm() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const projectIdFromQuery = (() => {
    const raw = searchParams.get("project_id");
    const v = raw ? Number(raw) : NaN;
    return Number.isFinite(v) && v > 0 ? v : undefined;
  })();
  const projectIdFromPath = (() => {
    const m = pathname.match(/\/organizational\/(\d+)\/workspace/i);
    if (m && m[1]) {
      const v = Number(m[1]);
      return Number.isFinite(v) && v > 0 ? v : undefined;
    }
    return undefined;
  })();
  const projectId = projectIdFromQuery ?? projectIdFromPath;
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [fields, setFields] = useState<ContentField[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [uploadingMedias, setUploadingMedias] = useState<Record<string, boolean>>({});

  // Load content type and fields on mount
  useEffect(() => {
    if (!id) return;
    loadContentType(Number(id));
  }, [id]);

  const loadContentType = async (contentTypeId: number) => {
    setLoading(true);
    setError(null);
    try {
      const ct = await contentService.getContentType(contentTypeId);
      setContentType(ct);
      
      // Combine regular fields and SEO fields
      const allFields = [...(ct.fields || []), ...(ct.seo_fields || [])];
      setFields(allFields);
      
      // Initialize form data with empty/default values for each field
      const initialData: Record<string, unknown> = {};
      allFields.forEach((field) => {
        if (field.type === "boolean") {
          initialData[field.name] = false;
        } else if (field.type === "number") {
          initialData[field.name] = 0;
        } else {
          initialData[field.name] = "";
        }
      });
      setFormData(initialData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load content type";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleMediaUpload = async (fieldName: string, file: File) => {
    setUploadingMedias((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const uploaded = await mediaService.upload(file, projectId ? { project_id: projectId } : {});
      setFormData((prev) => ({
        ...prev,
        [`${fieldName}_media_id`]: uploaded.id,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Media upload failed: ${msg}`);
    } finally {
      setUploadingMedias((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Validate and save entry
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentType) return;

    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      for (const field of fields) {
        if (field.required && !formData[field.name]) {
          setError(`Field "${field.name}" is required`);
          setSubmitting(false);
          return;
        }
      }

      // Create entry with field data
      // IMPORTANT: Send data directly, backend expects field names at top level
      await contentService.createEntry(contentType.id, formData);

      setShowSuccess(true);
      
      // Reset form
      const initialData: Record<string, unknown> = {};
      fields.forEach((field) => {
        initialData[field.name] = field.type === "boolean" ? false : "";
      });
      setFormData(initialData);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create entry";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldInput = (field: ContentField) => {
    const value = formData[field.name];
    const baseInputClass =
      "mt-1 w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]";

    switch (field.type) {
      case "string":
      case "email":
      case "url":
        return (
          <input
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
            placeholder={field.placeholder}
            value={String(value || "")}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
            required={field.required}
            maxLength={field.max_length}
          />
        );
      case "text":
        return (
          <textarea
            placeholder={field.placeholder}
            value={String(value || "")}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
            required={field.required}
            rows={4}
          />
        );
      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            value={Number(value || 0)}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            className={baseInputClass}
            required={field.required}
            min={field.min_value}
            max={field.max_value}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={String(value || "")}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
            required={field.required}
          />
        );
      case "boolean":
        return (
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-[var(--foreground)]">Enable</span>
          </label>
        );
      case "media":
        return (
          <div className="mt-1">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMediaUpload(field.name, file);
              }}
              disabled={uploadingMedias[field.name]}
              className={baseInputClass}
            />
            {uploadingMedias[field.name] && (
              <div className="mt-2 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm text-[var(--muted-foreground)]">Uploading...</span>
              </div>
            )}
          </div>
        );
      default:
        return <input type="text" className={baseInputClass} />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-[var(--card-bg)] text-[var(--foreground)] rounded-lg shadow-sm flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin h-8 w-8" />
          <span className="text-sm text-[var(--muted-foreground)]">Loading content type...</span>
        </div>
      </div>
    );
  }

  const contentFields = fields.filter((f) => !f.is_seo);
  const seoFields = fields.filter((f) => f.is_seo);

  return (
    <div className="p-6 bg-[var(--card-bg)] text-[var(--foreground)] rounded-lg shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">{contentType?.name || "New Entry"}</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Create new entry for this content type
          </p>
        </div>
      </div>

      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded bg-red-100 text-red-800 text-sm border border-red-300"
          >
            ❌ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded bg-green-100 text-green-800 text-sm border border-green-300"
          >
            ✅ Entry created successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Content Fields */}
        {contentFields.length > 0 && (
          <fieldset>
            <legend className="text-md font-semibold mb-4 text-[var(--foreground)]">Content</legend>
            <div className="space-y-4">
              {contentFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    {field.name} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.help_text && (
                    <p className="text-xs text-[var(--muted-foreground)] mb-1">{field.help_text}</p>
                  )}
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
          </fieldset>
        )}

        {/* SEO Fields */}
        {seoFields.length > 0 && (
          <fieldset>
            <legend className="text-md font-semibold mb-4 text-[var(--foreground)]">SEO Settings</legend>
            <div className="space-y-4">
              {seoFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    {field.name} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.help_text && (
                    <p className="text-xs text-[var(--muted-foreground)] mb-1">{field.help_text}</p>
                  )}
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
          </fieldset>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
          <button
            type="submit"
            disabled={submitting || fields.length === 0}
            className="bg-[color:var(--primary)] hover:bg-[color:var(--primary-hover)] disabled:opacity-50 text-[var(--button-text)] px-6 py-2 rounded transition flex items-center gap-2"
          >
            {submitting && <Loader className="h-4 w-4 animate-spin" />}
            {submitting ? "Creating..." : "Create Entry"}
          </button>
        </div>
      </form>

      {/* No Fields Message */}
      {fields.length === 0 && !loading && (
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          <p>No fields defined for this content type.</p>
          <p className="text-sm">Please add fields in Content Builder first.</p>
        </div>
      )}
    </div>
  );
}
