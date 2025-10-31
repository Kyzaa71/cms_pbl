"use client";

import { useParams, useRouter } from "next/navigation";
import { RoleDetailView } from "@/components/role-permissions/role-detail-view";
import { dummyRoles, Role, formatRoleName, countUsersWithRole } from "@/components/role-permissions/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id ? parseInt(params.id as string) : null;

  const role = roleId ? dummyRoles.find((r) => r.id === roleId) : null;

  const handleDuplicate = () => {
    router.push(`/role-permissions/create?duplicate=${roleId}`);
  };

  const handleDelete = () => {
    const userCount = countUsersWithRole(roleId || 0);
    if (userCount > 0) {
      alert(
        `Cannot delete role "${formatRoleName(role?.name || "")}" because it is assigned to ${userCount} user${userCount !== 1 ? "s" : ""}.`
      );
      return;
    }

    if (
      confirm(`Are you sure you want to delete role "${formatRoleName(role?.name || "")}"?`)
    ) {
      // In a real app, this would call an API
      console.log("Delete role:", roleId);
      router.push("/role-permissions");
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
      <RoleDetailView role={role || null} onDuplicate={handleDuplicate} onDelete={handleDelete} />
    </div>
  );
}

