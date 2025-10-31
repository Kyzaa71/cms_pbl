"use client";

import { useParams, useRouter } from "next/navigation";
import { UserDetailView } from "@/components/user-management/user-detail-view";
import { dummyUsers } from "@/components/user-management/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id as string) : null;

  const user = userId ? dummyUsers.find((u) => u.id === userId) : null;

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

