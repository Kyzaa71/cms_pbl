"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
