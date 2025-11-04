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
import { ContentField, getFieldTypeLabel } from "@/components/content-builder/types";
import { FieldForm } from "@/components/content-builder/field-form";

interface FieldsListProps {
  contentTypeId: number;
  fields: ContentField[];
  onFieldsChange: (fields: ContentField[]) => void;
}

export function FieldsList({ contentTypeId, fields, onFieldsChange }: FieldsListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingField, setEditingField] = useState<ContentField | null>(null);

  const regularFields = fields.filter((f) => !f.isSeo);
  const seoFields = fields.filter((f) => f.isSeo);

  const handleEdit = (field: ContentField) => {
    setEditingField(field);
    setShowAddForm(true);
  };

  const handleDelete = (field: ContentField) => {
    if (confirm(`Are you sure you want to delete field "${field.name}"?`)) {
      // In a real app, this would call: DELETE /content/fields/:field_id
      const updatedFields = fields.filter((f) => f.id !== field.id);
      onFieldsChange(updatedFields);
      console.log("Delete field:", field.id);
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingField(null);
  };

  const handleFormSubmit = (fieldData: Partial<ContentField>) => {
    if (editingField) {
      // Update existing field
      // In a real app, this would call: PUT /content/fields/:field_id
      const updatedFields = fields.map((f) =>
        f.id === editingField.id ? { ...f, ...fieldData } : f
      );
      onFieldsChange(updatedFields);
    } else {
      // Add new field
      // In a real app, this would call: POST /content/types/:content_type_id/fields
      const newField: ContentField = {
        id: Date.now(), // Temporary ID
        contentTypeId,
        name: fieldData.name!,
        type: fieldData.type!,
        required: fieldData.required || false,
        isSeo: fieldData.isSeo || false,
        unique: fieldData.unique || false,
        ...fieldData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      onFieldsChange([...fields, newField]);
    }
    handleFormClose();
  };

  return (
    <div className="space-y-6">
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
            {regularFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onEdit={() => handleEdit(field)}
                onDelete={() => handleDelete(field)}
              />
            ))}
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
            {seoFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onEdit={() => handleEdit(field)}
                onDelete={() => handleDelete(field)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldCardProps {
  field: ContentField;
  onEdit: () => void;
  onDelete: () => void;
}

function FieldCard({ field, onEdit, onDelete }: FieldCardProps) {
  return (
    <Card className="p-4 border border-[var(--border)] bg-[var(--card-bg-inner)] hover:border-[var(--primary)]/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h5 className="font-medium text-[var(--foreground)]">{field.name}</h5>
            <Badge variant="outline" className="text-xs border-[var(--border)]">
              {getFieldTypeLabel(field.type)}
            </Badge>
            {field.required && (
              <Badge className="bg-[var(--danger)] text-white text-xs">Required</Badge>
            )}
            {field.isSeo && (
              <Badge className="bg-[var(--secondary)] text-white text-xs">SEO</Badge>
            )}
            {field.unique && (
              <Badge className="bg-purple-600 text-white text-xs">Unique</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
            {field.placeholder && (
              <span>Placeholder: {field.placeholder}</span>
            )}
            {field.maxLength && <span>Max: {field.maxLength}</span>}
            {field.minLength && <span>Min: {field.minLength}</span>}
            {field.helpText && <span className="italic">{field.helpText}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/content-builder/${field.contentTypeId}/fields/${field.id}/validation`}
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

