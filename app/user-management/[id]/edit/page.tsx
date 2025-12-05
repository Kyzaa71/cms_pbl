"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserForm } from "@/components/user-management/user-form";
import type { User as UIUser, Role as UIRole } from "@/components/user-management/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { userService, roleService } from "@/lib/services/user-service";
import type { User as BackendUser, Role as BackendRole } from "@/types/backend-models";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id as string) : null;
  const [user, setUser] = useState<UIUser | null>(null);
  const [roles, setRoles] = useState<UIRole[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      try {
        const [u, r] = await Promise.all([userService.getById(userId), roleService.list()]);
        const mapped: UIUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role?.name || String(u.role_id),
          roleId: u.role_id,
          status: (u.status as "active" | "inactive") || "active",
          avatar: u.profile,
          createdAt: u.created_at,
          provider: u.provider,
        };
        setUser(mapped);
        setRoles(r.map((x: BackendRole) => ({ id: x.id, name: x.name, description: x.description })));
      } catch {}
    };
    load();
  }, [userId]);

  const handleSave = (userData: Partial<UIUser>) => {
    if (!userId) return;
    userService
      .update(userId, { name: userData.name, email: userData.email, role_id: userData.roleId })
      .then(() => router.push(`/user-management/${userId}`))
      .catch((e) => alert(e?.message || "Failed to update user"));
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          User not found
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
            onClick={() => router.push(`/user-management/${userId}`)}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Edit User
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Update user information and settings
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <UserForm user={user} roles={roles} mode="edit" onSave={handleSave} />
    </div>
  );
}

