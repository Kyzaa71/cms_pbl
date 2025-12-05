"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoleDetailView } from "@/components/role-permissions/role-detail-view";
import type { Role as UIRole, Permission as UIPermission } from "@/components/role-permissions/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { roleService, userService } from "@/lib/services/user-service";
import type { Role as BackendRole, Permission as BackendPermission } from "@/types/backend-models";

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id ? parseInt(params.id as string) : null;
  const [role, setRole] = useState<UIRole | null>(null);
  useEffect(() => {
    if (!roleId) return;
    Promise.all([roleService.getById(roleId), userService.list()])
      .then(([r, users]) => {
        const perms: UIPermission[] = (r.permissions || []).map((p: BackendPermission) => ({
          id: p.id,
          roleId: p.role_id,
          module: p.module as any,
          action: p.action as any,
          fieldScope: p.field_scope as any,
          allowedFields: Array.isArray(p.allowed_fields) ? (p.allowed_fields as string[]) : undefined,
          deniedFields: Array.isArray(p.denied_fields) ? (p.denied_fields as string[]) : undefined,
          contentTypeIds: Array.isArray(p.content_type_ids) ? (p.content_type_ids as number[]) : undefined,
        }));
        setRole({ id: r.id, name: r.name, description: r.description, permissions: perms, createdAt: r.created_at, updatedAt: r.updated_at });
        // Optionally compute assigned user count for role
        const count = (users as BackendUser[]).filter((u) => u.role_id === r.id).length;
        // Pass via props by setting in local state or keep logic in detail view via props
        setAssignedCount(count);
      })
      .catch(() => setRole(null));
  }, [roleId]);

  const handleDuplicate = () => {
    router.push(`/role-permissions/create?duplicate=${roleId}`);
  };

  const [assignedCount, setAssignedCount] = useState<number>(0);
  const handleDelete = async () => {
    if (!roleId) return;
    if (assignedCount > 0) {
      alert(`Cannot delete role because it is assigned to ${assignedCount} user${assignedCount !== 1 ? "s" : ""}.`);
      return;
    }
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await roleService.remove(roleId);
      router.push("/role-permissions");
    } catch (e) {
      alert((e as any)?.message || "Failed to delete role");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/role-permissions")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Role Details
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              View detailed information about this role and its permissions
            </p>
          </div>
        </div>
      </div>

      {/* Detail View */}
      <RoleDetailView role={role || null} onDuplicate={handleDuplicate} onDelete={handleDelete} userCount={assignedCount} />
    </div>
  );
}

