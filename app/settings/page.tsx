"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types/backend-models";
import { getInitials as getUserInitials } from "@/components/user-management/types";
import { useContentTypes } from "@/hooks/use-content";

export default function AccountOverviewPage() {
  const router = useRouter();
  const { user: storeUser, setUser } = useAuthStore();
  const [user, setLocalUser] = useState<User | null>(storeUser);
  const { data: contentTypes } = useContentTypes();

  useEffect(() => {
    const load = async () => {
      try {
        const me = await authService.getCurrentUser();
        setLocalUser(me);
        setUser(me);
      } catch {}
    };
    load();
  }, [setUser]);

  useEffect(() => {
    if (storeUser) setLocalUser(storeUser);
  }, [storeUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Account Overview
      </h1>

      {/* Account Card */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)] shadow-sm rounded-xl">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)] font-semibold">
              {getUserInitials(((user?.name || "").replace(/[^A-Za-z ]/g, "")) || "Unknown User")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {user?.name || "Unknown User"}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {user?.email || "-"}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Role: <span className="font-medium text-[var(--primary)]">{user?.role?.name || "-"}</span>
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Projects: <span className="font-medium">{(contentTypes || []).length} Active Projects</span>
            </p>
          </div>

          {/* Solid Buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => {
                if (user?.id) {
                  router.push(`/user-management/${user.id}/edit`);
                } else {
                  // Fallback if user ID is missing (e.g. session expired or loading)
                  console.error("User ID missing", user);
                  // Optionally redirect to login or show toast
                }
              }}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] font-medium px-5"
            >
              Edit Profile
            </Button>
            <Button className="bg-[var(--secondary)] hover:opacity-90 text-[var(--button-text)] font-medium px-5">
              Manage Subscription
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Organization</h3>
          <p className="text-sm text-[var(--muted-foreground)]">{user?.organization || "-"}</p>
        </Card>

        <Card className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Projects</h3>
          <p className="text-sm text-[var(--muted-foreground)]">{(contentTypes || []).length} Active Projects</p>
        </Card>
      </div>
    </div>
  );
}
