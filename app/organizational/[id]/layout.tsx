"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FolderKanban, Users, Settings } from "lucide-react";

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const pathname = usePathname();

  const menuItems = [
    {
      title: "Projects",
      icon: FolderKanban,
      href: `/organizational/${id}`,
    },
    {
      title: "Collaborator",
      icon: Users,
      href: `/organizational/${id}/collaborator`,
    },
    {
      title: "Settings",
      icon: Settings,
      href: `/organizational/${id}/setting`,
    },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className="w-64 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] 
        border-r border-[var(--border)] p-4 shadow-sm transition-colors duration-300"
      >
        <h2 className="text-lg font-semibold mb-6">Organizational</h2>

        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-[var(--primary)] bg-[color-mix(in srgb, var(--primary) 10%, transparent)]"
                    : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--primary)]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
