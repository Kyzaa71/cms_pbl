"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ContentManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSections, setOpenSections] = useState({
    singlePage: false,
    multiplePage: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border)]">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
            Content Management
          </h2>

          {/* Search Box */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded text-sm 
                bg-[var(--input-bg)] text-[var(--foreground)] 
                focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          {/* Single Page */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection("singlePage")}
              className="flex items-center justify-between w-full p-2 rounded hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[color:var(--primary)] rounded-full flex items-center justify-center text-[var(--button-text)] text-xs">
                  1
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Single Page
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${
                  openSections.singlePage ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSections.singlePage && (
              <div className="ml-7 mt-1">
                <Link
                  href="/content-management/single-page"
                  className="block text-sm text-[color:var(--link)] hover:text-[color:var(--link-hover)] py-1 transition-colors"
                >
                  Nama Content
                </Link>
              </div>
            )}
          </div>

          {/* Multiple Page */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection("multiplePage")}
              className="flex items-center justify-between w-full p-2 rounded hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[color:var(--primary)] rounded-full flex items-center justify-center text-[var(--button-text)] text-xs">
                  2
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Multiple Page
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${
                  openSections.multiplePage ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSections.multiplePage && (
              <div className="ml-7 mt-1">
                <Link
                  href="/content-management/multiple-page"
                  className="block text-sm text-[color:var(--link)] hover:text-[color:var(--link-hover)] py-1 transition-colors"
                >
                  Nama Content
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-[var(--content-bg)] p-8 overflow-y-auto transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}
