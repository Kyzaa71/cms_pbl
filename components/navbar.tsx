"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { User, Moon, Sun, LogOut, CreditCard, Info } from "lucide-react";
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

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

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
        {/* 🔹 Breadcrumb kiri */}
        <h1 className="text-base sm:text-lg font-semibold text-[var(--foreground)] capitalize">
          Pages / {getPageName()}
        </h1>

        {/* 🔹 Tombol kanan (Dark Mode + User Dropdown) */}
        <div className="flex items-center">
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
                <User size={16} /> Welcome Back, Your Name
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

              <DropdownMenuItem asChild>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <LogOut size={16} /> Log Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
