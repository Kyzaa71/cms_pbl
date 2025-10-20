"use client";

import { usePathname } from "next/navigation";
import {DashboardCards} from "@/components/dashboard-cards";

export default function DashboardPage() {
  const pathname = usePathname();

  const getPageName = () => {
    if (pathname === "/") return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    return last
      ? last
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Dashboard";
  };

  return (
    <div>
      
      <DashboardCards />
    </div>
  );
}
