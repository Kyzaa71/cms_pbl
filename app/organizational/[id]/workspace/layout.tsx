"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Layers, Folder, GitBranch, CheckSquare, Home } from "lucide-react";

export default function OrgWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const pathname = usePathname();
  const [projectName, setProjectName] = useState<string | null>(null);

  const base = `/organizational/${id}/workspace`;

  const menuItems = [
    {
      title: "Overview",
      icon: Home,
      href: base,
      exact: true,
    },
    {
      title: "Content Builder",
      icon: Layers,
      href: `${base}/content-builder`,
    },
    {
      title: "Content Entries",
      icon: Folder,
      href: `${base}/entries`,
    },
    {
      title: "Workflow",
      icon: GitBranch,
      href: `${base}/workflow`,
    },
    {
      title: "Approval",
      icon: CheckSquare,
      href: `${base}/approval`,
    },
    {
      title: "Media",
      icon: Folder,
      href: `${base}/media`,
    },
    {
      title: "Relations",
      icon: Folder,
      href: `${base}/relations`,
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedName = window.localStorage.getItem("active_project_name");
      setProjectName(storedName);
    } catch {
      setProjectName(null);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card-bg-inner)]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {projectName ? projectName : "Organization"}
              <span className="text-xs font-normal text-[var(--muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--muted)]/50 border border-[var(--border)]">
                ID: {id}
              </span>
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">Workspace khusus organisasi</p>
          </div>
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                  ].join(" ")}
                >
                  <item.icon
                    className={[
                      "w-4 h-4",
                      isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--primary)]",
                    ].join(" ")}
                  />
                  <span>{item.title}</span>
                  <span
                    className={[
                      "absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full transition-all",
                      isActive ? "bg-[var(--primary)]" : "bg-transparent group-hover:bg-[var(--border)]",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="w-full overflow-x-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
