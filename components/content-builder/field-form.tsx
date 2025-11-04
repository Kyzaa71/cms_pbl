"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { ContentField, fieldTypes } from "@/components/content-builder/types";

interface FieldFormProps {
  field?: ContentField | null;
  contentTypeId: number;
  onSubmit: (fieldData: Partial<ContentField>) => void;
  onCancel: () => void;
}

export function FieldForm({ field, contentTypeId, onSubmit, onCancel }: FieldFormProps) {
  const [formData, setFormData] = useState({
    name: field?.name || "",
    type: field?.type || "string",
    required: field?.required || false,
    isSeo: field?.isSeo || false,
    unique: field?.unique || false,
    maxLength: field?.maxLength || undefined,
    minLength: field?.minLength || undefined,
    pattern: field?.pattern || "",
    minValue: field?.minValue || undefined,
    maxValue: field?.maxValue || undefined,
    defaultValue: field?.defaultValue || "",
    placeholder: field?.placeholder || "",
    helpText: field?.helpText || "",
  });

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || "",
        type: field.type || "string",
        required: field.required || false,
        isSeo: field.isSeo || false,
        unique: field.unique || false,
        maxLength: field.maxLength || undefined,
        minLength: field.minLength || undefined,
        pattern: field.pattern || "",
        minValue: field.minValue || undefined,
        maxValue: field.maxValue || undefined,
        defaultValue: field.defaultValue || "",
        placeholder: field.placeholder || "",
        helpText: field.helpText || "",
      });
    }
  }, [field]);

  const isNumberType = formData.type === "number";
  const isTextType = formData.type === "string" || formData.type === "text" || formData.type === "email" || formData.type === "url";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Field name is required");
      return;
    }

    // Clean up undefined values
    const cleanData: Partial<ContentField> = {
      name: formData.name,
      type: formData.type,
      required: formData.required,
      isSeo: formData.isSeo,
      unique: formData.unique,
      contentTypeId,
    };

    // Add optional fields only if they have values
    if (formData.maxLength) cleanData.maxLength = formData.maxLength;
    if (formData.minLength) cleanData.minLength = formData.minLength;
    if (formData.pattern) cleanData.pattern = formData.pattern;
    if (formData.minValue !== undefined) cleanData.minValue = formData.minValue;
    if (formData.maxValue !== undefined) cleanData.maxValue = formData.maxValue;
    if (formData.defaultValue) cleanData.defaultValue = formData.defaultValue;
    if (formData.placeholder) cleanData.placeholder = formData.placeholder;
    if (formData.helpText) cleanData.helpText = formData.helpText;

    onSubmit(cleanData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] border border-[var(--border)] custom-scrollbar">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {field ? "Edit Field" : "Add New Field"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 rounded hover:bg-[var(--hover)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--muted-foreground)]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[var(--foreground)]">
                Field Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., title, body, price"
                className="mt-1 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
                required
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Used in API and must be unique within this content type
              </p>
            </div>

            {/* Field Type */}
            <div>
              <Label htmlFor="type" className="text-sm font-medium text-[var(--foreground)]">
                Field Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="mt-1 border-[var(--border)] bg-[var(--input-bg)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((ft) => (
                    <SelectItem key={ft.value} value={ft.value}>
                      {ft.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                <div>
                  <p className="font-medium text-sm text-[var(--foreground)]">Required</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Field must be filled before saving
                  </p>
                </div>
                <Switch
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                <div>
                  <p className="font-medium text-sm text-[var(--foreground)]">SEO Field</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    This field is used for SEO metadata
                  </p>
                </div>
                <Switch
                  checked={formData.isSeo}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSeo: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                <div>
                  <p className="font-medium text-sm text-[var(--foreground)]">Unique</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Values must be unique across all entries
                  </p>
                </div>
                <Switch
                  checked={formData.unique}
                  onCheckedChange={(checked) => setFormData({ ...formData, unique: checked })}
                />
              </div>
            </div>

            {/* Text-specific validations */}
            {isTextType && (
              <div className="space-y-4 p-4 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Text Validation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength" className="text-xs text-[var(--muted-foreground)]">
                      Min Length
                    </Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={formData.minLength || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minLength: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength" className="text-xs text-[var(--muted-foreground)]">
                      Max Length
                    </Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={formData.maxLength || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pattern" className="text-xs text-[var(--muted-foreground)]">
                    Pattern (Regex)
                  </Label>
                  <Input
                    id="pattern"
                    type="text"
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    placeholder="e.g., ^[A-Za-z]+$"
                    className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                  />
                </div>
              </div>
            )}

            {/* Number-specific validations */}
            {isNumberType && (
              <div className="space-y-4 p-4 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Number Validation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minValue" className="text-xs text-[var(--muted-foreground)]">
                      Min Value
                    </Label>
                    <Input
                      id="minValue"
                      type="number"
                      step="any"
                      value={formData.minValue || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minValue: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxValue" className="text-xs text-[var(--muted-foreground)]">
                      Max Value
                    </Label>
                    <Input
                      id="maxValue"
                      type="number"
                      step="any"
                      value={formData.maxValue || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxValue: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Optional Fields */}
            <div className="space-y-4 p-4 bg-[var(--card-bg-inner)] rounded-lg border border-[var(--border)]">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">Optional Settings</h4>
              <div>
                <Label htmlFor="defaultValue" className="text-xs text-[var(--muted-foreground)]">
                  Default Value
                </Label>
                <Input
                  id="defaultValue"
                  type="text"
                  value={formData.defaultValue}
                  onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                  className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                />
              </div>
              <div>
                <Label htmlFor="placeholder" className="text-xs text-[var(--muted-foreground)]">
                  Placeholder
                </Label>
                <Input
                  id="placeholder"
                  type="text"
                  value={formData.placeholder}
                  onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                  className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                />
              </div>
              <div>
                <Label htmlFor="helpText" className="text-xs text-[var(--muted-foreground)]">
                  Help Text
                </Label>
                <Input
                  id="helpText"
                  type="text"
                  value={formData.helpText}
                  onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                  className="mt-1 border-[var(--border)] bg-[var(--input-bg)]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
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
                {field ? "Update Field" : "Create Field"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

