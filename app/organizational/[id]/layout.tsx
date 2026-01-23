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
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-[var(--card-bg-inner)]/80 backdrop-blur border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold">
              <Link href="/organizational" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
                <span className="bg-[var(--primary)] text-[var(--primary-foreground)] p-1 rounded-md">
                  <FolderKanban className="w-5 h-5" />
                </span>
                <span>Organizational</span>
              </Link>
            </h2>
            <div className="h-6 w-px bg-[var(--border)]" />
            <nav className="flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = item.href === `/organizational/${id}`
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4",
                        isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
                      )}
                    />
                    <span>{item.title}</span>
                    <span
                      className={cn(
                        "absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full transition-all",
                        isActive ? "bg-[var(--primary)]" : "bg-transparent group-hover:bg-[var(--border)]"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
