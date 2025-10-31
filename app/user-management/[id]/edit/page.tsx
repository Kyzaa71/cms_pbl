"use client";

import { useParams, useRouter } from "next/navigation";
import { UserForm } from "@/components/user-management/user-form";
import { dummyUsers, dummyRoles, User } from "@/components/user-management/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id as string) : null;

  const user = userId ? dummyUsers.find((u) => u.id === userId) : null;

  const handleSave = (userData: Partial<User>) => {
    // In a real app, this would call an API
    // For now, just navigate back to the detail page
    // In a real implementation, you'd update the state/API here
    router.push(`/user-management/${userId}`);
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
      <UserForm user={user} roles={dummyRoles} mode="edit" onSave={handleSave} />
    </div>
  );
}

