"use client";

import { useRouter } from "next/navigation";
import { UserForm } from "@/components/user-management/user-form";
import { dummyRoles, dummyUsers, User } from "@/components/user-management/types";

export default function CreateUserPage() {
  const router = useRouter();

  const handleSave = (userData: Partial<User>) => {
    // In a real app, this would call an API
    // For now, just navigate back to the list page
    // In a real implementation, you'd update the state/API here
    router.push("/user-management");
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
      <UserForm roles={dummyRoles} mode="create" onSave={handleSave} />
    </div>
  );
}

