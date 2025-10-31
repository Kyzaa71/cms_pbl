"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Mail,
  User as UserIcon,
  Shield,
  Filter,
} from "lucide-react";
import { dummyUsers, dummyRoles, getInitials, getRoleBadgeColor, User } from "@/components/user-management/types";

export default function UserManagementPage() {
  const router = useRouter();
  const [users] = useState<User[]>(dummyUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Note: In a real app, users would be fetched from API
  // For now, we use dummy data

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.roleId.toString() === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handlers
  const handleView = (userId: number) => {
    router.push(`/user-management/${userId}`);
  };

  const handleEdit = (userId: number) => {
    router.push(`/user-management/${userId}/edit`);
  };

  const handleDelete = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // In a real app, this would call an API
      // For now, just show confirmation
      console.log("Delete user:", userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            User Management
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
            Manage users, roles, and permissions across your CMS platform
          </p>
        </div>
        <Link href="/user-management/create">
          <Button className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] !cursor-pointer flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New User
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-[var(--border)] bg-[var(--input-bg)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] border-[var(--border)] bg-[var(--input-bg)]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {dummyRoles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </div>
            <UserIcon className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[var(--success)] to-[var(--success-hover)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-[var(--secondary)] to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Roles</p>
              <p className="text-2xl font-bold mt-1">{dummyRoles.length}</p>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Inactive</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter((u) => u.status === "inactive").length}
              </p>
            </div>
            <UserIcon className="w-8 h-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Created</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--card-bg-inner)]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-[var(--muted-foreground)]"
                >
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-t border-[var(--border)] ${
                    index % 2 === 0
                      ? "bg-[var(--card-bg-inner)]"
                      : "bg-[var(--card-bg)]"
                  } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
                >
                  {/* User Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)]">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {user.name}
                        </p>
                        {user.provider && (
                          <p className="text-xs text-[var(--muted-foreground)] capitalize">
                            {user.provider} login
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-[var(--foreground)]">{user.email}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <Badge className={`${getRoleBadgeColor(user.role)} border-none`}>
                      {user.role}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {user.status === "active" ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-none">
                        Inactive
                      </Badge>
                    )}
                  </td>

                  {/* Created */}
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(user.id)}
                        className="text-[var(--primary)] hover:text-[color-mix(in srgb, var(--primary) 80%, black)]"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user.id)}
                        className="text-yellow-600 hover:text-[color-mix(in srgb, yellow 80%, black)] dark:text-yellow-500"
                        title="Edit User"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

