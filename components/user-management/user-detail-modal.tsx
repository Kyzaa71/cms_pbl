"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { User } from "./types";
import { getInitials } from "./types";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* User Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--border)]">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)] text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">{user.name}</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{user.email}</p>
          </div>
          <Badge
            className={
              user.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            }
          >
            {user.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[var(--muted-foreground)]">Role</Label>
            <p className="text-[var(--foreground)] font-medium">{user.role}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-[var(--muted-foreground)]">Provider</Label>
            <p className="text-[var(--foreground)] font-medium capitalize">
              {user.provider || "Local"}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-[var(--muted-foreground)]">User ID</Label>
            <p className="text-[var(--foreground)] font-medium">#{user.id}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-[var(--muted-foreground)]">Created At</Label>
            <p className="text-[var(--foreground)] font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

