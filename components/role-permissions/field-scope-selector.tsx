"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FIELD_SCOPES } from "./types";
import { getFieldScopeLabel } from "./types";
import { CustomFieldEditor } from "./custom-field-editor";

interface FieldScopeSelectorProps {
  value: "all" | "seo_only" | "non_seo_only" | "custom";
  onChange: (value: "all" | "seo_only" | "non_seo_only" | "custom") => void;
  onCustomChange?: (allowed: string[], denied: string[]) => void;
  customFields?: {
    allowed: string[];
    denied: string[];
  };
}

export function FieldScopeSelector({
  value,
  onChange,
  onCustomChange,
  customFields,
}: FieldScopeSelectorProps) {
  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[var(--input-bg)] border-[var(--border)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FIELD_SCOPES.map((scope) => (
            <SelectItem key={scope} value={scope}>
              {getFieldScopeLabel(scope)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Field Editor (only shown when fieldScope is "custom") */}
      {value === "custom" && onCustomChange && customFields && (
        <div className="mt-4">
          <CustomFieldEditor
            allowedFields={customFields.allowed || []}
            deniedFields={customFields.denied || []}
            onChange={onCustomChange}
          />
        </div>
      )}
    </div>
  );
}

