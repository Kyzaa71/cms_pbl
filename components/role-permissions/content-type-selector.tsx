"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { dummyContentTypes } from "./types";

interface ContentTypeSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export function ContentTypeSelector({ value, onChange }: ContentTypeSelectorProps) {
  const toggleContentType = (contentTypeId: number) => {
    if (value.includes(contentTypeId)) {
      onChange(value.filter((id) => id !== contentTypeId));
    } else {
      onChange([...value, contentTypeId]);
    }
  };

  const selectAll = () => {
    if (value.length === dummyContentTypes.length) {
      onChange([]);
    } else {
      onChange(dummyContentTypes.map((ct) => ct.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-[var(--foreground)]">
          Limit to Specific Content Types (Optional)
        </Label>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-[var(--primary)] hover:underline"
        >
          {value.length === dummyContentTypes.length ? "Deselect All" : "Select All"}
        </button>
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">
        If no content types are selected, permission applies to all content types.
      </p>
      <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="space-y-2">
          {dummyContentTypes.map((contentType) => (
            <div
              key={contentType.id}
              className="flex items-center space-x-2 p-2 hover:bg-[var(--card-bg-inner)] rounded-md transition-colors"
            >
              <Checkbox
                id={`content-type-${contentType.id}`}
                checked={value.includes(contentType.id)}
                onCheckedChange={() => toggleContentType(contentType.id)}
                className="border-[var(--border)]"
              />
              <Label
                htmlFor={`content-type-${contentType.id}`}
                className="text-sm text-[var(--foreground)] cursor-pointer flex-1"
              >
                {contentType.name} ({contentType.slug})
              </Label>
            </div>
          ))}
        </div>
        {value.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)]">
              Selected: {value.length} of {dummyContentTypes.length} content types
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

