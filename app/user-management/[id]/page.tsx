"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserDetailView } from "@/components/user-management/user-detail-view";
import type { User as UIUser } from "@/components/user-management/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { userService } from "@/lib/services/user-service";
import type { User as BackendUser } from "@/types/backend-models";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id as string) : null;
  const [user, setUser] = useState<UIUser | null>(null);
  useEffect(() => {
    if (!userId) return;
    userService.getById(userId).then((u: BackendUser) => {
      const mapped: UIUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role?.name || String(u.role_id),
        roleId: u.role_id,
        status: (u.status as "active" | "inactive") || "active",
        avatar: u.profile,
        createdAt: u.created_at,
        provider: u.provider,
      };
      setUser(mapped);
    }).catch(() => setUser(null));
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/user-management")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              User Details
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              View detailed information about this user
            </p>
          </div>
        </div>
      </div>

      {/* Detail View */}
      <UserDetailView user={user || null} />
    </div>
  );
}

