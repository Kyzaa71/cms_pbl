"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Deteksi halaman auth (login atau signup)
  const isAuthPage =
    pathname?.startsWith("/auth/login") || pathname?.startsWith("/auth/signup") || 
    pathname?.startsWith("/auth/forgot-password") || pathname?.startsWith("/auth/forgot-password/check-email") || 
    pathname?.startsWith("/auth/forgot-password/new-password") ;

  // Kalau halaman login/signup, hilangkan sidebar & navbar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Default layout untuk semua halaman lain
  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar fixed */}
      <Sidebar onToggle={setCollapsed} />

      {/* Area kanan */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: collapsed ? "5rem" : "16rem", // w-20 = 5rem, w-64 = 16rem
        }}
      >
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
