"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoleForm } from "@/components/role-permissions/role-form";
import type { Role as UIRole, Permission as UIPermission } from "@/components/role-permissions/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { roleService } from "@/lib/services/user-service";
import type { Role as BackendRole, Permission as BackendPermission } from "@/types/backend-models";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id ? parseInt(params.id as string) : null;
  const [role, setRole] = useState<UIRole | null>(null);
  useEffect(() => {
    if (!roleId) return;
    roleService
      .getById(roleId)
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
        setRole({ id: r.id, name: r.name, description: r.description, permissions: perms, createdAt: r.created_at, updatedAt: r.updated_at });
      })
      .catch(() => setRole(null));
  }, [roleId]);

  const handleSave = (data: { name: string; description: string; permissions: UIPermission[] }) => {
    if (!roleId) return;
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
      .update(roleId, payload)
      .then(() => router.push(`/role-permissions/${roleId}`))
      .catch((e) => alert(e?.message || "Failed to update role"));
  };

  if (!role) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          Role not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/role-permissions/${roleId}`)}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Edit Role
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Update role information and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <RoleForm role={role} mode="edit" onSave={handleSave} />
    </div>
  );
}
