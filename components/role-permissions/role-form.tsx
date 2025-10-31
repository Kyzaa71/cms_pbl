"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionMatrix } from "./permission-matrix";
import { Role, Permission } from "./types";

interface RoleFormProps {
  role?: Role | null;
  mode: "create" | "edit";
  onSave: (data: { name: string; description: string; permissions: Permission[] }) => void;
}

export function RoleForm({ role, mode, onSave }: RoleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
  });
  const [permissions, setPermissions] = useState<Permission[]>(role?.permissions || []);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
      });
      setPermissions(role.permissions || []);
    } else {
      setFormData({
        name: "",
        description: "",
      });
      setPermissions([]);
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Role name is required");
      return;
    }

    // Validate permissions
    if (permissions.length === 0) {
      if (!confirm("No permissions selected. Continue anyway?")) {
        return;
      }
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      permissions: permissions.map((p) => ({
        ...p,
        // Clean up undefined values
        allowedFields: p.allowedFields && p.allowedFields.length > 0 ? p.allowedFields : undefined,
        deniedFields: p.deniedFields && p.deniedFields.length > 0 ? p.deniedFields : undefined,
        contentTypeIds: p.contentTypeIds && p.contentTypeIds.length > 0 ? p.contentTypeIds : undefined,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., editor, content_writer"
              required
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Use lowercase letters and underscores (e.g., content_writer)
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this role"
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <PermissionMatrix permissions={permissions} onChange={setPermissions} />

      {/* Summary */}
      {permissions.length > 0 && (
        <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)] text-lg">Permission Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--foreground)]">
              <strong>{permissions.length}</strong> permission{permissions.length !== 1 ? "s" : ""}{" "}
              configured
            </p>
            <div className="mt-3 space-y-1">
              {["ContentEntry", "Media", "SEO"].map((module) => {
                const modulePerms = permissions.filter((p) => p.module === module);
                if (modulePerms.length === 0) return null;
                return (
                  <div key={module} className="text-sm text-[var(--muted-foreground)]">
                    <strong className="text-[var(--foreground)]">{module}:</strong>{" "}
                    {modulePerms.map((p) => p.action).join(", ")}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
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
          {mode === "create" ? "Create Role" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

