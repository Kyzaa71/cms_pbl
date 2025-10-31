"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Copy,
  Shield,
  Filter,
  Users,
} from "lucide-react";
import {
  dummyRoles,
  Role,
  formatRoleName,
  countPermissions,
  countUsersWithRole,
} from "@/components/role-permissions/types";

export default function RolePermissionsPage() {
  const router = useRouter();
  const [roles] = useState<Role[]>(dummyRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (moduleFilter === "all") {
      return matchesSearch;
    }

    const hasModulePermission = role.permissions.some(
      (p) => p.module === moduleFilter
    );
    return matchesSearch && hasModulePermission;
  });

  // Handlers
  const handleView = (roleId: number) => {
    router.push(`/role-permissions/${roleId}`);
  };

  const handleEdit = (roleId: number) => {
    router.push(`/role-permissions/${roleId}/edit`);
  };

  const handleDuplicate = (role: Role) => {
    if (confirm(`Duplicate role "${formatRoleName(role.name)}"?`)) {
      // In a real app, this would call an API
      console.log("Duplicate role:", role.id);
      router.push(`/role-permissions/create?duplicate=${role.id}`);
    }
  };

  const handleDelete = (role: Role) => {
    const userCount = countUsersWithRole(role.id);
    if (userCount > 0) {
      alert(
        `Cannot delete role "${formatRoleName(role.name)}" because it is assigned to ${userCount} user${userCount !== 1 ? "s" : ""}.`
      );
      return;
    }

    if (confirm(`Are you sure you want to delete role "${formatRoleName(role.name)}"?`)) {
      // In a real app, this would call an API
      console.log("Delete role:", role.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Role & Permissions
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage roles and their permissions across your CMS platform
          </p>
        </div>
        <Link href="/role-permissions/create">
          <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Role
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            />
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="ContentEntry">Content Entry</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="SEO">SEO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Roles</p>
              <p className="text-2xl font-bold mt-1">{roles.length}</p>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[var(--success)] to-[var(--success-hover)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Permissions</p>
              <p className="text-2xl font-bold mt-1">
                {roles.reduce((sum, r) => sum + countPermissions(r), 0)}
              </p>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[var(--secondary)] to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Roles</p>
              <p className="text-2xl font-bold mt-1">
                {roles.filter((r) => countUsersWithRole(r.id) > 0).length}
              </p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Unassigned</p>
              <p className="text-2xl font-bold mt-1">
                {roles.filter((r) => countUsersWithRole(r.id) === 0).length}
              </p>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Roles Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-semibold">Role Name</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold">Permissions</th>
              <th className="py-3 px-4 font-semibold">Users</th>
              <th className="py-3 px-4 font-semibold">Created</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--card-bg-inner)]">
            {filteredRoles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No roles found matching your criteria
                </td>
              </tr>
            ) : (
              filteredRoles.map((role, index) => {
                const userCount = countUsersWithRole(role.id);
                return (
                  <tr
                    key={role.id}
                    className={`border-t border-[var(--border)] ${
                      index % 2 === 0
                        ? "bg-[var(--card-bg-inner)]"
                        : "bg-[var(--card-bg)]"
                    } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
                  >
                    {/* Role Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[var(--primary)]" />
                        <span className="font-medium text-[var(--foreground)]">
                          {formatRoleName(role.name)}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-[var(--border)] text-xs"
                        >
                          {role.name}
                        </Badge>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <span className="text-[var(--foreground)]">
                        {role.description || "-"}
                      </span>
                    </td>

                    {/* Permissions Count */}
                    <td className="py-3 px-4">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                        {countPermissions(role)} permission
                        {countPermissions(role) !== 1 ? "s" : ""}
                      </Badge>
                    </td>

                    {/* Users Count */}
                    <td className="py-3 px-4">
                      {userCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
                          <span className="text-[var(--foreground)]">{userCount}</span>
                        </div>
                      ) : (
                        <span className="text-[var(--muted-foreground)]">0</span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(role.id)}
                          className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(role.id)}
                          className="text-yellow-600 hover:text-[color-mix(in srgb, yellow 80%, black)] dark:text-yellow-500"
                          title="Edit Role"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(role)}
                          className="text-blue-600 hover:text-[color-mix(in srgb, blue 80%, black)] dark:text-blue-500"
                          title="Duplicate Role"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(role)}
                          className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                          title="Delete Role"
                          disabled={userCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

