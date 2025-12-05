"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RoleForm } from "@/components/role-permissions/role-form";
import type { Role as UIRole, Permission as UIPermission } from "@/components/role-permissions/types";
import { roleService } from "@/lib/services/user-service";
import type { Role as BackendRole, Permission as BackendPermission } from "@/types/backend-models";

export default function CreateRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicate");

  // If duplicating, get the original role
  const [originalRole, setOriginalRole] = useState<UIRole | null>(null);
  useEffect(() => {
    const idNum = duplicateId ? parseInt(duplicateId) : null;
    if (!idNum) return;
    roleService
      .getById(idNum)
      .then((r: BackendRole) => {
        const perms: UIPermission[] = (r.permissions || []).map((p: BackendPermission) => ({
          id: p.id,
          roleId: p.role_id,
          module: p.module as "ContentEntry" | "Media" | "SEO",
          action: p.action as "create" | "read" | "update" | "delete" | "approve",
          fieldScope: p.field_scope as "all" | "seo_only" | "non_seo_only" | "custom",
          allowedFields: Array.isArray(p.allowed_fields) ? (p.allowed_fields as string[]) : undefined,
          deniedFields: Array.isArray(p.denied_fields) ? (p.denied_fields as string[]) : undefined,
          contentTypeIds: Array.isArray(p.content_type_ids) ? (p.content_type_ids as number[]) : undefined,
        }));
        setOriginalRole({ id: r.id, name: r.name, description: r.description, permissions: perms, createdAt: r.created_at, updatedAt: r.updated_at });
      })
      .catch(() => setOriginalRole(null));
  }, [duplicateId]);

  const handleSave = (data: { name: string; description: string; permissions: UIPermission[] }) => {
    const payload = {
      name: data.name,
      description: data.description,
      permissions: data.permissions.map((p) => ({
        module: p.module,
        action: p.action,
        field_scope: p.fieldScope,
        allowed_fields: p.allowedFields,
        denied_fields: p.deniedFields,
        content_type_ids: p.contentTypeIds,
      })),
    };
    roleService
      .create(payload)
      .then(() => router.push(`/role-permissions`))
      .catch((e) => alert(e?.message || "Failed to create role"));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            {originalRole ? "Duplicate Role" : "Create New Role"}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            {originalRole
              ? `Create a copy of "${originalRole.name}" with a new name`
              : "Define a new role and configure its permissions"}
          </p>
        </div>
      </div>

      {/* Form */}
      <RoleForm
        role={originalRole ? {
          ...originalRole,
          name: "", // Clear name for duplicate
          description: originalRole.description + " (Copy)",
        } : null}
        mode="create"
        onSave={handleSave}
      />
    </div>
  );
}
