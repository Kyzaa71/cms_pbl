"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserForm } from "@/components/user-management/user-form";
import type { User as UIUser, Role as UIRole } from "@/components/user-management/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { userService, roleService } from "@/lib/services/user-service";
import { useAuth } from "@/hooks/use-auth";
import type { User as BackendUser, Role as BackendRole } from "@/types/backend-models";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/services/auth-service";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { user: storeUser, setUser: setStoreUser } = useAuthStore();
  const { updateMe } = useAuth();
  const userId = params?.id ? parseInt(params.id as string) : null;
  const [user, setUser] = useState<UIUser | null>(null);
  const [roles, setRoles] = useState<UIRole[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      // Ensure storeUser is hydrated
      if (!storeUser) {
        try {
          const me = await authService.getCurrentUser();
          if (me) setStoreUser(me);
        } catch {}
      }
      const isSelf = !!storeUser && storeUser.id === userId;
      const isAdmin = (storeUser?.role?.name || "").toLowerCase() === "admin";
      try {
        let mapped: UIUser | null = null;
        if (isSelf && storeUser) {
          const u = storeUser as unknown as BackendUser;
          mapped = {
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
        } else {
          const u = await userService.getById(userId);
          mapped = {
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
        }
        setUser(mapped);
        if (isAdmin) {
          const r = await roleService.listGlobal();
          setRoles(r.map((x: BackendRole) => ({ id: x.id, name: x.name, description: x.description })));
        } else {
          setRoles([]);
        }
      } catch {
        if (isSelf && storeUser) {
          const u = storeUser as unknown as BackendUser;
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
          setRoles([]);
        } else {
          setUser(null);
        }
      }
    };
    load();
  }, [userId, storeUser, setStoreUser]);

  const handleSave = (userData: Partial<UIUser> & { password?: string }) => {
    if (!userId) return;
    const isAdmin = (storeUser?.role?.name || "").toLowerCase() === "admin";
    const isSelf = storeUser?.id === userId;
    const payload: { name?: string; email?: string; role_id?: number; password?: string } = {
      name: userData.name,
      email: userData.email,
      ...(isAdmin && typeof userData.roleId === "number" ? { role_id: userData.roleId } : {}),
    };
    if (userData.password) {
      payload.password = userData.password;
    }
    if (isSelf && !isAdmin) {
      const selfPayload: { name?: string; email?: string; password?: string } = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      updateMe(selfPayload)
        .then(() => router.push(`/settings`))
        .catch((e) => alert(e?.message || "Failed to update profile"));
    } else {
      userService
        .update(userId, payload)
        .then(() => router.push(`/user-management/${userId}`))
        .catch((e) => alert(e?.message || "Failed to update user"));
    }
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

  // Hide role/status for non-admins
  const isSelf = storeUser?.id === user.id;
  const isAdmin = storeUser?.role?.name?.toLowerCase() === "admin";
  const canEditRoleStatus = isAdmin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(isAdmin ? `/user-management/${userId}` : `/settings`)}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Edit {isSelf ? "Profile" : "User"}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Update user information and settings
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <UserForm 
        user={user} 
        roles={roles} 
        mode="edit" 
        onSave={handleSave} 
        hideRoleStatus={!canEditRoleStatus} 
      />
    </div>
  );
}

