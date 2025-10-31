"use client";

import { usePathname } from "next/navigation";

export default function PageHeader() {
  const pathname = usePathname();

  // ambil nama path terakhir dari URL, misal /content-builder → Content Builder
  const getPageName = () => {
    if (pathname === "/") return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    return last
      ? last
          .replace(/-/g, " ") // ganti "-" jadi spasi
          .replace(/\b\w/g, (c) => c.toUpperCase()) // kapital tiap kata
      : "Dashboard";
  };

  return (
    <h2 className="text-lg font-semibold mb-4">
      Pages / {getPageName()}
    </h2>
  );
}
