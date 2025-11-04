"use client";

import { DashboardCards } from "@/components/dashboard/dashboard-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
    <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
          Overview of your projects, content, and activities across the platform
        </p>
      </div>
      
      <DashboardCards />
    </div>
  );
}
