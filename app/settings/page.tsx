"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AccountOverviewPage() {
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
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback className="bg-[var(--primary)] text-[var(--button-text)] font-semibold">
              AZ
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Alvaro Zeka Ricardo
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              alvaro.ricardo@example.com
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Role: <span className="font-medium text-[var(--primary)]">Admin</span>
            </p>
          </div>

          {/* Solid Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] font-medium px-5"
            >
              Edit Profile
            </Button>
            <Button
              className="bg-[var(--secondary)] hover:opacity-90 text-[var(--button-text)] font-medium px-5"
            >
              Manage Subscription
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Organization</h3>
          <p className="text-sm text-[var(--muted-foreground)]">CMS CmLabs</p>
        </Card>

        <Card className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Projects</h3>
          <p className="text-sm text-[var(--muted-foreground)]">5 Active Projects</p>
        </Card>

        <Card className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Last Login</h3>
          <p className="text-sm text-[var(--muted-foreground)]">20 Oct 2025, 09:32 AM</p>
        </Card>
      </div>
    </div>
  );
}
