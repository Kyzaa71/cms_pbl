"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RoleForm } from "@/components/role-permissions/role-form";
import { dummyRoles, Role, Permission } from "@/components/role-permissions/types";

export default function CreateRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicate");

  // If duplicating, get the original role
  const originalRole = duplicateId
    ? dummyRoles.find((r) => r.id === parseInt(duplicateId))
    : null;

  const handleSave = (data: {
    name: string;
    description: string;
    permissions: Permission[];
  }) => {
    // In a real app, this would call an API
    // For now, just navigate back to the list page
    console.log("Create role:", data);
    router.push("/role-permissions");
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

