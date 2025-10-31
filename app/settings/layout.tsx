"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, Code2, Workflow } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Account Info",
      icon: User,
      href: "/settings/account",
    },
    {
      title: "API Integration",
      icon: Code2,
      href: "/settings/api",
    },
    {
      title: "Workflow Approval",
      icon: Workflow,
      href: "/settings/workflow",
    },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] border-r border-[var(--border)] p-4">
        <h2 className="text-lg font-semibold mb-6">Settings</h2>

        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--primary)] bg-[var(--sidebar-hover)]"
                    : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--primary-hover)]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--muted-foreground)]"
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[var(--content-bg)] p-8 overflow-y-auto transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
