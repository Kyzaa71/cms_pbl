"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Role } from "./types";

interface UserFormProps {
  user?: User | null;
  roles: Role[];
  mode: "create" | "edit";
  onSave: (data: Partial<User> & { password?: string }) => void;
  hideRoleStatus?: boolean;
}

export function UserForm({ user, roles, mode, onSave, hideRoleStatus = false }: UserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    roleId: user?.roleId || roles[0]?.id || 0,
    status: (user?.status as "active" | "inactive") || "active",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        status: user.status,
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        roleId: roles[0]?.id || 0,
        status: "active",
        password: "",
      });
    }
  }, [user, roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      email: formData.email,
      roleId: formData.roleId,
      status: formData.status,
      ...(formData.password ? { password: formData.password } : {}),
    });
  };

  return (
    <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-[var(--foreground)]">
          {mode === "create" ? "Create New User" : "Edit User"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          {!hideRoleStatus && (
            <>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.roleId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, roleId: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1 bg-[var(--input-bg)] border-[var(--border)]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                >
                  <SelectTrigger className="mt-1 bg-[var(--input-bg)] border-[var(--border)]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Password {mode === "edit" && "(Leave blank to keep current)"}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={mode === "create" ? "Enter password" : "Leave blank to keep current password"}
              required={mode === "create"}
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer"
            >
              {mode === "create" ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

