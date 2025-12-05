"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { User, Moon, Sun, LogOut, CreditCard, Info, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔹 Generate nama halaman dari pathname
  const getPageName = () => {
    if (!pathname) return "Dashboard";
    if (pathname === "/content-builder" || pathname === "/content-builder/home")
      return "Home";
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    return last
      ? last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Dashboard";
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--dropdown-border)] transition-colors">
      <div className="flex h-14 items-center justify-between px-6">
        {/* 🔹 Kiri: Breadcrumb */}
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-semibold text-[var(--foreground)] capitalize">
            Pages / {getPageName()}
          </h1>
        </div>

        {/* 🔹 Tombol kanan (Translate + Dark Mode + User Dropdown) */}
        <div className="flex items-center">
          {/* Translate button (visible on entry detail pages) */}
          {(() => {
            const m = pathname?.match(/^\/content-management\/\d+\/entries\/\d+/);
            if (!m) return null;
            const parts = pathname.split("/").filter(Boolean);
            const entryId = Number(parts[parts.length - 1]);
            return (
              <TranslateButton entryId={entryId} />
            );
          })()}
          {/* Dark mode toggle */}
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex items-center gap-2 mr-3 text-sm border-[var(--dropdown-border)] text-[var(--foreground)] hover:bg-[var(--card-bg-mid-alt)] hover:text-[var(--card-text)] transition-colors"
          >
            {theme === "light" ? (
              <>
                <Moon size={16} /> Dark Mode
              </>
            ) : (
              <>
                <Sun size={16} /> Light Mode
              </>
            )}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="flex items-center gap-2 bg-[var(--card-bg-mid)] text-[var(--card-text)] hover:bg-[var(--card-bg-mid-alt)] transition-colors"
              >
                <User size={16} /> Welcome Back, {(user?.name || user?.email || "Unknown User")}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-md border border-[var(--dropdown-border)] bg-[var(--dropdown-bg)] text-[var(--dropdown-text)] shadow-md transition-colors"
            >
              <DropdownMenuLabel className="text-[var(--dropdown-text)]">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--dropdown-border)]" />

              <DropdownMenuItem asChild>
                <Link
                  href="/settings/account"
                  className="flex items-center gap-2 hover:bg-[var(--dropdown-hover-bg)] hover:text-[var(--dropdown-hover-text)] transition-colors"
                >
                  <Info size={16} /> Account Info
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/plan-billing"
                  className="flex items-center gap-2 hover:bg-[var(--dropdown-hover-bg)] hover:text-[var(--dropdown-hover-text)] transition-colors"
                >
                  <CreditCard size={16} /> Plan & Billing
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[var(--dropdown-border)]" />

              <DropdownMenuItem
                onClick={() => { logout(); }}
                className="flex items-center gap-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function TranslateButton({ entryId }: { entryId: number }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 mr-3 text-sm border-[var(--dropdown-border)] text-[var(--foreground)] hover:bg-[var(--card-bg-mid-alt)] hover:text-[var(--card-text)] transition-colors"
      >
        <Languages size={16} /> Translate
      </Button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative w-[320px] rounded-md border border-[var(--border)] bg-[var(--card-bg-inner)] p-4 shadow-lg">
            <p className="text-sm text-[var(--muted-foreground)] mb-2">Target Language</p>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full border border-[var(--border)] rounded px-2 py-2 bg-[var(--input-bg)] text-[var(--foreground)]"
            >
              <option value="en">English (en)</option>
              <option value="id">Indonesian (id)</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  try {
                    await contentService.translateEntry(entryId, { target_lang: lang });
                    setOpen(false);
                  } catch {
                    alert("Failed to translate");
                  }
                }}
                className="!bg-[var(--primary)] hover:!bg-[var(--primary-hover)] !text-white"
              >
                Translate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { contentService } from "@/lib/services/content-service";
