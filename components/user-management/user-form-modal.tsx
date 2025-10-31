"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, Role } from "./types";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  user?: User | null;
  roles: Role[];
  mode: "create" | "edit";
}

export function UserFormModal({ isOpen, onClose, onSave, user, roles, mode }: UserFormModalProps) {
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
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New User" : "Edit User"}
      size="md"
    >
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
            onValueChange={(value: "active" | "inactive") =>
              setFormData({ ...formData, status: value })
            }
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

        {mode === "create" && (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)]"
          >
            {mode === "create" ? "Create User" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

