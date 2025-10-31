"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Copy, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Role,
  getPermissionLabel,
  getFieldScopeLabel,
  countPermissions,
  countUsersWithRole,
  formatRoleName,
} from "./types";
import { dummyContentTypes } from "./types";

interface RoleDetailViewProps {
  role: Role | null;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function RoleDetailView({ role, onDuplicate, onDelete }: RoleDetailViewProps) {
  const router = useRouter();

  if (!role) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        Role not found
      </div>
    );
  }

  const userCount = countUsersWithRole(role.id);

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[var(--foreground)] text-2xl">
                {formatRoleName(role.name)}
              </CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {role.description || "No description provided"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/role-permissions/${role.id}/edit`)}
                className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Role
              </Button>
              {onDuplicate && (
                <Button
                  variant="outline"
                  onClick={onDuplicate}
                  className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[var(--muted-foreground)]">Total Permissions</Label>
              <p className="text-[var(--foreground)] font-semibold text-lg">
                {countPermissions(role)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--muted-foreground)]">Assigned Users</Label>
              <p className="text-[var(--foreground)] font-semibold text-lg">{userCount}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[var(--muted-foreground)]">Role ID</Label>
              <p className="text-[var(--foreground)] font-semibold">#{role.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Detail */}
      <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          {role.permissions.length === 0 ? (
            <p className="text-center py-8 text-[var(--muted-foreground)]">
              No permissions configured for this role
            </p>
          ) : (
            <div className="space-y-4">
              {/* Group by Module */}
              {["ContentEntry", "Media", "SEO"].map((module) => {
                const modulePermissions = role.permissions.filter((p) => p.module === module);
                if (modulePermissions.length === 0) return null;

                return (
                  <div key={module} className="border-b border-[var(--border)] pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-[var(--foreground)] mb-3">
                      {module === "ContentEntry" ? "Content Entry" : module}
                    </h3>
                    <div className="space-y-2">
                      {modulePermissions.map((perm, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between p-3 bg-[var(--card-bg)] rounded-md"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className="border-[var(--border)] text-[var(--foreground)]"
                              >
                                {perm.action.charAt(0).toUpperCase() + perm.action.slice(1)}
                              </Badge>
                              {perm.fieldScope && (
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                                  {getFieldScopeLabel(perm.fieldScope)}
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              {perm.fieldScope === "custom" && (
                                <div className="space-y-1">
                                  {perm.allowedFields && perm.allowedFields.length > 0 && (
                                    <div>
                                      <span className="text-[var(--muted-foreground)]">
                                        Allowed:
                                      </span>{" "}
                                      <span className="text-[var(--foreground)]">
                                        {perm.allowedFields.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {perm.deniedFields && perm.deniedFields.length > 0 && (
                                    <div>
                                      <span className="text-[var(--muted-foreground)]">
                                        Denied:
                                      </span>{" "}
                                      <span className="text-[var(--foreground)]">
                                        {perm.deniedFields.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {perm.contentTypeIds && perm.contentTypeIds.length > 0 && (
                                <div>
                                  <span className="text-[var(--muted-foreground)]">
                                    Limited to:
                                  </span>{" "}
                                  <span className="text-[var(--foreground)]">
                                    {perm.contentTypeIds
                                      .map((id) => {
                                        const ct = dummyContentTypes.find((c) => c.id === id);
                                        return ct ? ct.name : `Content Type ${id}`;
                                      })
                                      .join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {onDelete && (
        <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                  Delete Role
                </p>
                <p className="text-sm text-red-600 dark:text-red-500">
                  {userCount > 0
                    ? `This role is assigned to ${userCount} user${userCount !== 1 ? "s" : ""}. Cannot delete.`
                    : "Once deleted, this role cannot be recovered. All permissions will be lost."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onDelete}
                disabled={userCount > 0}
                className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !text-[var(--danger)] !border-red-300 dark:!border-red-700 hover:!bg-red-100 dark:hover:!bg-red-900/20 hover:!border-red-400 dark:hover:!border-red-600 disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-transparent disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Role
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

