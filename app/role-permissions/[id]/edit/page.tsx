"use client";

import { useParams, useRouter } from "next/navigation";
import { RoleForm } from "@/components/role-permissions/role-form";
import { dummyRoles, Role, Permission } from "@/components/role-permissions/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id ? parseInt(params.id as string) : null;

  const role = roleId ? dummyRoles.find((r) => r.id === roleId) : null;

  const handleSave = (data: {
    name: string;
    description: string;
    permissions: Permission[];
  }) => {
    // In a real app, this would call an API
    // For now, just navigate back to the detail page
    console.log("Update role:", roleId, data);
    router.push(`/role-permissions/${roleId}`);
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

