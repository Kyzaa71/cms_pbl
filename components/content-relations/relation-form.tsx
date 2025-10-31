"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntrySelector } from "./entry-selector";
import { RELATION_TYPES, RelationType } from "./types";

interface RelationFormProps {
  fromContentId?: number;
  onSubmit: (data: { fromContentId: number; toContentId: number; relationType: RelationType }) => void;
  onCancel: () => void;
  initialData?: {
    toContentId?: number;
    relationType?: RelationType;
  };
}

export function RelationForm({
  fromContentId,
  onSubmit,
  onCancel,
  initialData,
}: RelationFormProps) {
  const [fromContentIdLocal, setFromContentIdLocal] = useState<number>(fromContentId || 0);
  const [toContentId, setToContentId] = useState<number>(initialData?.toContentId || 0);
  const [relationType, setRelationType] = useState<RelationType>(
    initialData?.relationType || "related"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFromId = fromContentId || fromContentIdLocal;
    if (!finalFromId || !toContentId || !relationType) return;
    if (finalFromId === toContentId) {
      alert("Cannot create relation to the same entry");
      return;
    }
    onSubmit({ fromContentId: finalFromId, toContentId, relationType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* From Entry Selector (if not provided) */}
      {!fromContentId ? (
        <EntrySelector
          value={fromContentIdLocal}
          onChange={setFromContentIdLocal}
          label="From Entry"
          placeholder="Search for source entry..."
        />
      ) : (
        <div>
          <Label>From Entry</Label>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Entry #{fromContentId} (Selected from context)
          </p>
        </div>
      )}

      {/* To Entry Selector */}
      <EntrySelector
        value={toContentId}
        onChange={setToContentId}
        excludeEntryId={fromContentId}
        label="To Entry"
        placeholder="Search for target entry..."
      />

      {/* Relation Type Selector */}
      <div>
        <Label htmlFor="relationType">
          Relation Type <span className="text-[var(--danger)]">*</span>
        </Label>
        <Select
          value={relationType}
          onValueChange={(value) => setRelationType(value as RelationType)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select relation type" />
          </SelectTrigger>
          <SelectContent>
            {RELATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {type.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={(!fromContentId && !fromContentIdLocal) || !toContentId || !relationType}
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--primary)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
        >
          Create Relation
        </Button>
      </div>
    </form>
  );
}

