"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout, getCurrentUser } = useAuth();
  const lastActiveRef = useRef<number>(Date.now());
  useEffect(() => {
    const onActive = () => { lastActiveRef.current = Date.now(); };
    const evs: (keyof WindowEventMap)[] = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    evs.forEach((e) => window.addEventListener(e, onActive));
    const timer = setInterval(async () => {
      const now = Date.now();
      if (now - lastActiveRef.current > 900_000) {
        await logout();
        return;
      }
      const token = api.getToken();
      const part = token ? token.split(".")[1] || "" : "";
      let exp = 0;
      try { exp = token ? JSON.parse(atob(part)).exp ?? 0 : 0; } catch {}
      const nowSec = Math.floor(now / 1000);
      const near = exp > 0 && exp <= nowSec + 60;
      const hasRefresh = typeof document !== "undefined" && !!localStorage.getItem("refresh_token");
      if (near && hasRefresh) {
        await getCurrentUser();
      }
    }, 30_000);
    return () => {
      clearInterval(timer);
      evs.forEach((e) => window.removeEventListener(e, onActive));
    };
  }, [logout, getCurrentUser]);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      getCurrentUser().catch(() => {});
    }
  }, [getCurrentUser]);

  // Deteksi halaman auth (login atau signup)
  const isAuthPage =
    pathname?.startsWith("/auth/login") || pathname?.startsWith("/auth/signup") || 
    pathname?.startsWith("/auth/forgot-password") || pathname?.startsWith("/auth/check-email") || 
    pathname?.startsWith("/auth/new-password") || pathname?.startsWith("/auth/success-reset-password") ||
    pathname?.startsWith("/auth/link-expired");

  // Kalau halaman auth, tampilkan tanpa layout tambahan
  if (isAuthPage) {
    return <>{children}</>; 
  }

  // Layout utama dengan sidebar dan navbar
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Sidebar onToggle={setSidebarCollapsed} />
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "80px" : "256px" }}
      >
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
