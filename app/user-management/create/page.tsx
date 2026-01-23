"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserForm } from "@/components/user-management/user-form";
import type { Role as UIRole, User as UIUser } from "@/components/user-management/types";
import { roleService, userService } from "@/lib/services/user-service";

export default function CreateUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<UIRole[]>([]);
  useEffect(() => {
    roleService.listGlobal().then((r) => setRoles(r.map((x) => ({ id: x.id, name: x.name, description: x.description }))));
  }, []);

  const handleSave = (userData: Partial<UIUser> & { password?: string }) => {
    if (!userData.email || !userData.name || !userData.roleId || !userData.password) {
      alert("Name, email, role, and password are required");
      return;
    }
    userService
      .create({ name: userData.name, email: userData.email, password: userData.password, role_id: userData.roleId })
      .then(() => router.push("/user-management"))
      .catch((e) => alert(e?.message || "Failed to create user"));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Create New User
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Add a new user to your CMS platform
          </p>
        </div>
      </div>

      {/* Form */}
      <UserForm roles={roles} mode="create" onSave={handleSave} />
    </div>
  );
}

