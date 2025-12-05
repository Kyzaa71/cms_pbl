"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { ContentField as DummyContentField, getFieldTypeLabel } from "@/components/content-builder/types";
import { ContentField as BackendContentField } from "@/types/backend-models";
import { contentActions } from "@/hooks/use-content";
import { contentService } from "@/lib/services/content-service";
import { FieldForm } from "@/components/content-builder/field-form";

type FieldUnion = DummyContentField | (BackendContentField & { isSeo?: boolean });
interface FieldsListProps {
  contentTypeId: number;
  fields: FieldUnion[];
  onFieldsChange: (fields: FieldUnion[]) => void;
}

export function FieldsList({ contentTypeId, fields, onFieldsChange }: FieldsListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingField, setEditingField] = useState<FieldUnion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const regularFields = fields.filter((f: any) => !f.isSeo && !f.is_seo);
  const seoFields = fields.filter((f: any) => f.isSeo || f.is_seo);

  const handleEdit = (field: FieldUnion) => {
    setEditingField(field);
    setShowAddForm(true);
  };

  const handleDelete = async (field: FieldUnion) => {
    if (!confirm(`Are you sure you want to delete field "${(field as any).name}"?`)) return;
    try {
      await contentActions.deleteField((field as any).id);
      try {
        const ct = await contentService.getContentType(contentTypeId);
        const updated = ([...(ct.fields || []), ...(ct.seo_fields || [])] as any);
        onFieldsChange(updated);
      } catch {
        const fallback = fields.filter((f: any) => f.id !== (field as any).id);
        onFieldsChange(fallback);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to delete field");
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingField(null);
  };

  const handleFormSubmit = async (fieldData: Partial<DummyContentField>) => {
    const payload: any = {
      name: fieldData.name!,
      type: fieldData.type!,
      required: !!fieldData.required,
      is_seo: !!fieldData.isSeo,
    };
    if (fieldData.unique !== undefined) payload.unique = fieldData.unique;
    if (fieldData.maxLength !== undefined) payload.max_length = fieldData.maxLength;
    if (fieldData.minLength !== undefined) payload.min_length = fieldData.minLength;
    if (fieldData.pattern) payload.pattern = fieldData.pattern;
    if ((fieldData as any).minValue !== undefined) payload.min_value = (fieldData as any).minValue;
    if ((fieldData as any).maxValue !== undefined) payload.max_value = (fieldData as any).maxValue;
    if (fieldData.defaultValue) payload.default_value = fieldData.defaultValue;
    if (fieldData.placeholder) payload.placeholder = fieldData.placeholder;
    if (fieldData.helpText) payload.help_text = fieldData.helpText;

    if (editingField) {
      await contentActions.updateField((editingField as any).id, payload);
    } else {
      await contentActions.addField(contentTypeId, payload);
    }
    try {
      const ct = await contentService.getContentType(contentTypeId);
      const refreshed = ([...(ct.fields || []), ...(ct.seo_fields || [])] as any);
      onFieldsChange(refreshed);
    } catch {
      // fallback to local update when refetch fails
      if (editingField) {
        const updatedFields = fields.map((f: any) => (f.id === (editingField as any).id ? { ...(f as any), ...payload } : f));
        onFieldsChange(updatedFields);
      } else {
        onFieldsChange([...(fields as any), payload as any]);
      }
    }
    handleFormClose();
  };

  return (
    <div className="space-y-6">
      {error && (
        <Card className="p-3 border border-[var(--danger)] bg-[color-mix(in srgb, var(--danger) 10%, var(--card-bg))] text-[var(--foreground)]">
          <div className="text-sm">{error}</div>
        </Card>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Fields Management
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Define and manage fields for this content type
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="!bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <FieldForm
          field={editingField}
          contentTypeId={contentTypeId}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}

      {/* Regular Fields */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
          Regular Fields ({regularFields.length})
        </h4>
        {regularFields.length > 0 ? (
          <div className="space-y-2">
            {regularFields.map((field, index) => {
              const fid = (field as any).id;
              const fname = (field as any).name;
              const key = typeof fid === "number" ? `id:${fid}` : `name:${String(fname)}:${index}`;
              return (
                <FieldCard
                  key={key}
                  field={field}
                  onEdit={() => handleEdit(field)}
                  onDelete={() => handleDelete(field)}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-6 text-center border border-[var(--border)] bg-[var(--card-bg-inner)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              No regular fields yet. Add your first field to get started.
            </p>
          </Card>
        )}
      </div>

      {/* SEO Fields */}
      {seoFields.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
            SEO Fields ({seoFields.length})
          </h4>
          <div className="space-y-2">
            {seoFields.map((field, index) => {
              const fid = (field as any).id;
              const fname = (field as any).name;
              const key = typeof fid === "number" ? `id:${fid}` : `name:${String(fname)}:${index}`;
              return (
                <FieldCard
                  key={key}
                  field={field}
                  onEdit={() => handleEdit(field)}
                  onDelete={() => handleDelete(field)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldCardProps {
  field: FieldUnion;
  onEdit: () => void;
  onDelete: () => void;
}

function FieldCard({ field, onEdit, onDelete }: FieldCardProps) {
  return (
    <Card className="p-4 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:border-[var(--primary)]/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h5 className="font-medium text-[var(--foreground)]">{(field as any).name}</h5>
          <Badge variant="outline" className="text-xs border-[var(--border)]">
              {getFieldTypeLabel((field as any).type)}
          </Badge>
            {(field as any).required && (
              <Badge className="bg-[var(--danger)] text-white text-xs">Required</Badge>
            )}
            {(field as any).isSeo || (field as any).is_seo ? (
              <Badge className="bg-[var(--secondary)] text-white text-xs">SEO</Badge>
            ) : null}
            {(field as any).unique && (
              <Badge className="bg-purple-600 text-white text-xs">Unique</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
            {(field as any).placeholder && (
              <span>Placeholder: {(field as any).placeholder}</span>
            )}
            {(field as any).max_length && <span>Max: {(field as any).max_length}</span>}
            {(field as any).min_length && <span>Min: {(field as any).min_length}</span>}
            {(field as any).help_text && <span className="italic">{(field as any).help_text}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/content-builder/${(field as any).contentTypeId || (field as any).content_type_id}/fields/${(field as any).id}/validation`}
            className="p-2 rounded hover:bg-[var(--hover)] transition-colors text-[var(--foreground)]"
            title="View Validation Rules"
          >
            <FileText className="w-4 h-4" />
          </Link>
          <button
            onClick={onEdit}
            className="p-2 rounded hover:bg-[var(--hover)] transition-colors text-[var(--primary)]"
            title="Edit Field"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded hover:bg-[var(--hover)] transition-colors text-[var(--danger)]"
            title="Delete Field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

