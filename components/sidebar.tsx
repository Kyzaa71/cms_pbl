"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Folder,
  FileText,
  Users,
  Bell,
  Settings,
} from "lucide-react";
import clsx from "clsx";

export const Sidebar = ({ onToggle }: { onToggle?: (collapsed: boolean) => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (onToggle) onToggle(collapsed);
  }, [collapsed, onToggle]);

  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Content Builder", icon: <Layers size={20} />, path: "/content-builder" },
    { name: "Content Management", icon: <Folder size={20} />, path: "/content-management" },
    { name: "Media Assets", icon: <FileText size={20} />, path: "/assets" },
    { divider: "Organizational" },
    { name: "Organizational Project", icon: <Users size={20} />, path: "/organizational" },
    { divider: "Personal" },
    { name: "Personal Project", icon: <FileText size={20} />, path: "/personal-project" },
    { name: "Notification", icon: <Bell size={20} />, path: "/notification" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const isActive = (menuPath?: string) => {
    if (!menuPath) return false;
    if (menuPath === "/") return pathname === "/";
    return pathname.startsWith(menuPath);
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50 shadow-lg",
        collapsed ? "w-20" : "w-64"
      )}
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--button-text)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <div className="flex items-center space-x-2 font-bold">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: "var(--button-text)" }}
            />
            <span>CMS Team#6</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex flex-col justify-center items-center space-y-[4px] cursor-pointer"
        >
          <div
            className="w-5 h-[2px] rounded"
            style={{ backgroundColor: "var(--button-text)" }}
          ></div>
          <div
            className="w-5 h-[2px] rounded"
            style={{ backgroundColor: "var(--button-text)" }}
          ></div>
          <div
            className="w-5 h-[2px] rounded"
            style={{ backgroundColor: "var(--button-text)" }}
          ></div>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {menus.map((menu, i) =>
          menu.divider ? (
            !collapsed && (
              <p
                key={i}
                className="text-xs uppercase font-semibold mt-4 mb-2 px-2"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {menu.divider}
              </p>
            )
          ) : (
            <Link
  key={menu.name}
  href={menu.path ?? "#"}
  className={clsx(
    "flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-200",
    collapsed ? "justify-center" : "justify-start"
  )}
  style={{
    backgroundColor: isActive(menu.path)
      ? "var(--sidebar-active-bg)"
      : "transparent",
    color: isActive(menu.path)
      ? "var(--sidebar-active-text)"
      : "var(--button-text)",
  }}
  onMouseEnter={(e) => {
    if (!isActive(menu.path))
      e.currentTarget.style.backgroundColor = "var(--primary-hover)";
  }}
  onMouseLeave={(e) => {
    if (!isActive(menu.path))
      e.currentTarget.style.backgroundColor = "transparent";
  }}
>
  {menu.icon}
  {!collapsed && <span>{menu.name}</span>}
</Link>

          )
        )}
      </nav>
    </aside>
  );
};
