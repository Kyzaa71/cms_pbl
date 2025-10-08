"use client";

import { usePathname } from "next/navigation";

export default function ContentBuilderPage() {
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
      <h1 className="text-lg font-semibold mb-4">
        Pages / {getPageName()}
      </h1>

      <div>
        <h2 className="text-2xl font-bold mb-2">Content Builder</h2>
        <p>Halaman untuk membuat dan mengatur konten.</p>
      </div>
    </div>
  );
}
