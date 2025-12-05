"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import type { ContentField } from "@/components/content-builder/types";
import { MediaSelectorModal } from "./media-selector-modal";
import { MediaFile } from "@/components/media-assets/types";

interface DynamicFieldRendererProps {
  field: ContentField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled,
}: DynamicFieldRendererProps) {
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  
  // For media fields, handle value structure
  // Value can be: { id, url, media_id } or just a string (url) or number (id)
  const getMediaValue = () => {
    if (field.type !== "media") return null;
    if (!value) return null;
    if (typeof value === "object" && value !== null) {
      return { id: value.id || value.media_id, url: value.url };
    }
    if (typeof value === "number") {
      return { id: value, url: "" };
    }
    if (typeof value === "string") {
      return { id: undefined, url: value };
    }
    return null;
  };

  const mediaValue = getMediaValue();
  const hasMedia = mediaValue && (mediaValue.id || mediaValue.url);

  const renderField = () => {
    switch (field.type) {
      case "string":
      case "email":
      case "url":
        return (
          <Input
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.name}`}
            maxLength={field.maxLength}
            minLength={field.minLength}
            pattern={field.pattern}
            disabled={!!disabled}
            className={`border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] ${error ? "border-[var(--danger)]" : ""}`}
          />
        );

      case "text":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.name}`}
            maxLength={field.maxLength}
            minLength={field.minLength}
            rows={4}
            disabled={!!disabled}
            className={`border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] ${error ? "border-[var(--danger)]" : ""}`}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => {
              const numValue = e.target.value === "" ? undefined : parseFloat(e.target.value);
              onChange(numValue);
            }}
            placeholder={field.placeholder || `Enter ${field.name}`}
            min={field.minValue}
            max={field.maxValue}
            step="any"
            disabled={!!disabled}
            className={`border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] ${error ? "border-[var(--danger)]" : ""}`}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={value || false}
              onCheckedChange={onChange}
              disabled={!!disabled}
            />
            <span className="text-sm text-[var(--muted-foreground)]">
              {value ? "Yes" : "No"}
            </span>
          </div>
        );

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={!!disabled}
            className={`border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] ${error ? "border-[var(--danger)]" : ""}`}
          />
        );

      case "media":
        return (
          <div className="space-y-2">
            {hasMedia ? (
              <div className="space-y-2">
                {/* Media Preview */}
                <div className="flex items-center gap-3 p-3 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                  {mediaValue.url && typeof mediaValue.url === "string" && mediaValue.url.startsWith("http") ? (
                    <div className="w-16 h-16 rounded overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] flex-shrink-0">
                      <img
                        src={mediaValue.url}
                        alt="Selected media"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-8 h-8 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {mediaValue.id ? `Media ID: ${mediaValue.id}` : "Media selected"}
                    </p>
                    {mediaValue.url && typeof mediaValue.url === "string" && (
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {mediaValue.url}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!disabled && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMediaSelector(true)}
                          className="flex-shrink-0"
                        >
                          Change
                        </Button>
                        <button
                          type="button"
                          onClick={() => onChange(undefined)}
                          className="p-1.5 rounded hover:bg-[var(--hover)] transition-colors text-[var(--danger)]"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMediaSelector(true)}
                disabled={!!disabled}
                className="w-full border-[var(--border)]"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Media
              </Button>
            )}

            {/* Media Selector Modal */}
            {showMediaSelector && (
              <MediaSelectorModal
                isOpen={showMediaSelector}
                onClose={() => setShowMediaSelector(false)}
                onSelect={(media: MediaFile) => {
                  // Store media data in format expected by backend
                  // Backend expects: {fieldName} = url, {fieldName}_media_id = id
                  const mediaData = {
                    id: media.id,
                    url: media.url,
                    media_id: media.id, // For backend compatibility
                  };
                  onChange(mediaData);
                }}
                currentMediaId={mediaValue?.id}
              />
            )}
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.name}`}
            disabled={!!disabled}
            className={`border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] ${error ? "border-[var(--danger)]" : ""}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium text-[var(--foreground)]">
        {field.name}
        {field.required && <span className="text-[var(--danger)] ml-1">*</span>}
        {field.isSeo && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[var(--secondary)]/10 text-[var(--secondary)]">
            SEO
          </span>
        )}
      </Label>
      {renderField()}
      {field.helpText && (
        <p className="text-xs text-[var(--muted-foreground)]">{field.helpText}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
}

