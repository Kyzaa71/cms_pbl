"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Home, FileText } from "lucide-react";

export default function ContentBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSections, setOpenSections] = useState({
    home: false,
    singlePage: false,
    multiplePage: false,
    component: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] border-r border-[var(--dropdown-border)] transition-colors duration-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Content Builder</h2>

          {/* === SEARCH BOX === */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--sidebar-text)]/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 rounded text-sm 
                bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--sidebar-text)]/50
                border border-[var(--dropdown-border)]
                focus:outline-none focus:border-[var(--card-bg-mid)]
                transition-colors duration-300"
            />
          </div>

          {/* === MENU ITEM COMPONENT === */}
          <nav className="space-y-2">
            {/* HOME */}
            <Link
              href="/content-builder/home"
              className="sidebar-item flex items-center gap-2 w-full p-2 rounded transition-colors"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[var(--card-bg-mid)]">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* SINGLE PAGE */}
            <div>
              <button
                onClick={() => toggleSection("singlePage")}
                className="sidebar-item flex items-center justify-between w-full p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[var(--card-bg-mid)] rounded-full flex items-center justify-center text-[var(--card-text)] text-xs">
                    1
                  </div>
                  <span className="text-sm font-medium">Single Page</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--sidebar-text)]/70 transition-transform ${
                    openSections.singlePage ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.singlePage && (
                <div className="ml-7 mt-1">
                  <Link
                    href="/content-builder/single-page"
                    className="block text-sm text-[var(--card-bg-mid)] hover:underline py-1"
                  >
                    Create Single Page
                  </Link>
                </div>
              )}
            </div>

            {/* MULTIPLE PAGE */}
            <div>
              <button
                onClick={() => toggleSection("multiplePage")}
                className="sidebar-item flex items-center justify-between w-full p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[var(--card-bg-mid)] rounded-full flex items-center justify-center text-[var(--card-text)] text-xs">
                    2
                  </div>
                  <span className="text-sm font-medium">Multiple Page</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--sidebar-text)]/70 transition-transform ${
                    openSections.multiplePage ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.multiplePage && (
                <div className="ml-7 mt-1">
                  <Link
                    href="/content-builder/multiple-page"
                    className="block text-sm text-[var(--card-bg-mid)] hover:underline py-1"
                  >
                    Create Multiple Page
                  </Link>
                </div>
              )}
            </div>

            {/* COMPONENT */}
            <div>
              <button
                onClick={() => toggleSection("component")}
                className="sidebar-item flex items-center justify-between w-full p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[var(--card-bg-mid)] rounded-full flex items-center justify-center text-[var(--card-text)] text-xs">
                    3
                  </div>
                  <span className="text-sm font-medium">Component</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--sidebar-text)]/70 transition-transform ${
                    openSections.component ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.component && (
                <div className="ml-7 mt-1">
                  <Link
                    href="/content-builder/component"
                    className="block text-sm text-[var(--card-bg-mid)] hover:underline py-1"
                  >
                    Create Component
                  </Link>
                </div>
              )}
            </div>

            {/* FIELD PAGE */}
            <Link
              href="/content-builder/field-page"
              className="sidebar-item flex items-center gap-2 w-full p-2 rounded transition-colors"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[var(--card-bg-mid)]">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Field Page</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1 bg-[var(--background)] text-[var(--foreground)] p-8 overflow-y-auto transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
