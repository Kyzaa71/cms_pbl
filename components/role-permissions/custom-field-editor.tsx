"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface CustomFieldEditorProps {
  allowedFields: string[];
  deniedFields: string[];
  onChange: (allowed: string[], denied: string[]) => void;
}

export function CustomFieldEditor({
  allowedFields,
  deniedFields,
  onChange,
}: CustomFieldEditorProps) {
  const [newAllowedField, setNewAllowedField] = useState("");
  const [newDeniedField, setNewDeniedField] = useState("");

  const addAllowedField = () => {
    if (newAllowedField.trim() && !allowedFields.includes(newAllowedField.trim())) {
      onChange([...allowedFields, newAllowedField.trim()], deniedFields);
      setNewAllowedField("");
    }
  };

  const removeAllowedField = (field: string) => {
    onChange(
      allowedFields.filter((f) => f !== field),
      deniedFields
    );
  };

  const addDeniedField = () => {
    if (newDeniedField.trim() && !deniedFields.includes(newDeniedField.trim())) {
      onChange(allowedFields, [...deniedFields, newDeniedField.trim()]);
      setNewDeniedField("");
    }
  };

  const removeDeniedField = (field: string) => {
    onChange(
      allowedFields,
      deniedFields.filter((f) => f !== field)
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allowed Fields (Whitelist) */}
        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <Label className="text-[var(--foreground)] mb-2 block">
            Allowed Fields (Whitelist)
          </Label>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">
            Only these fields will be accessible. Leave empty to allow all fields.
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              value={newAllowedField}
              onChange={(e) => setNewAllowedField(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAllowedField();
                }
              }}
              placeholder="Field name (e.g., title)"
              className="bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
            <Button
              type="button"
              size="icon"
              onClick={addAllowedField}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {allowedFields.length === 0 ? (
              <span className="text-xs text-[var(--muted-foreground)] italic">
                No allowed fields specified
              </span>
            ) : (
              allowedFields.map((field) => (
                <Badge
                  key={field}
                  variant="outline"
                  className="border-[var(--border)] text-[var(--foreground)] flex items-center gap-1"
                >
                  {field}
                  <button
                    onClick={() => removeAllowedField(field)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </Card>

        {/* Denied Fields (Blacklist) */}
        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <Label className="text-[var(--foreground)] mb-2 block">
            Denied Fields (Blacklist)
          </Label>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">
            These fields will be excluded. All other fields will be accessible.
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              value={newDeniedField}
              onChange={(e) => setNewDeniedField(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDeniedField();
                }
              }}
              placeholder="Field name (e.g., internal_notes)"
              className="bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
            <Button
              type="button"
              size="icon"
              onClick={addDeniedField}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {deniedFields.length === 0 ? (
              <span className="text-xs text-[var(--muted-foreground)] italic">
                No denied fields specified
              </span>
            ) : (
              deniedFields.map((field) => (
                <Badge
                  key={field}
                  variant="outline"
                  className="border-[var(--border)] text-[var(--foreground)] flex items-center gap-1"
                >
                  {field}
                  <button
                    onClick={() => removeDeniedField(field)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </Card>
      </div>

      {allowedFields.length > 0 && deniedFields.length > 0 && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> You have both allowed and denied fields configured. Allowed fields
            (whitelist) will take precedence if both are set.
          </p>
        </div>
      )}
    </div>
  );
}

