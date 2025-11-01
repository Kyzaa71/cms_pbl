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
  Image,
  GitBranch,
  CheckSquare,
  Building2,
  User,
  Shield,
  Link2,
  Globe,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
};

type MenuDivider = {
  divider: string;
};

type Menu = MenuItem | MenuDivider;

export const Sidebar = ({ onToggle }: { onToggle?: (collapsed: boolean) => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (onToggle) onToggle(collapsed);
  }, [collapsed, onToggle]);

  const menus: Menu[] = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    
    { divider: "CONTENT MANAGEMENT" },
    { name: "Content Builder", icon: Layers, path: "/content-builder" },
    { name: "Content Management", icon: Folder, path: "/content-management" },
    { name: "Content Relations", icon: Link2, path: "/content-relations" },
    { name: "Search", icon: Search, path: "/search" },
    
    
    { divider: "MEDIA & ASSETS" },
    { name: "Media Library", icon: Image, path: "/assets" },
    
    { divider: "WORKFLOW & APPROVAL" },
    { name: "Workflow Management", icon: GitBranch, path: "/workflow-management" },
    { name: "Approval Queue", icon: CheckSquare, path: "/approval-queue" },
    
    { divider: "PROJECT MANAGEMENT" },
    { name: "Organizational Project", icon: Building2, path: "/organizational" },
    { name: "Personal Project", icon: User, path: "/personal-project" },
    
    { divider: "USER & ROLE MANAGEMENT" },
    { name: "User Management", icon: Users, path: "/user-management" },
    { name: "Role & Permissions", icon: Shield, path: "/role-permissions" },
    
    { divider: "SYSTEM & SETTINGS" },
    { name: "Notifications", icon: Bell, path: "/notification" },
    { name: "Settings", icon: Settings, path: "/settings" },
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
          <div className="flex items-center gap-2 font-bold">
            <div
              className="w-6 h-6 rounded flex-shrink-0"
              style={{ backgroundColor: "var(--button-text)" }}
            />
            <span className="truncate">CMS Team#6</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex flex-col justify-center items-center gap-1.5 cursor-pointer p-1.5 rounded-md hover:bg-white/10 transition-colors duration-200 flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div
            className="w-5 h-0.5 rounded transition-all duration-200"
            style={{ backgroundColor: "var(--button-text)" }}
          ></div>
          <div
            className="w-5 h-0.5 rounded transition-all duration-200"
            style={{ backgroundColor: "var(--button-text)" }}
          ></div>
          <div
            className="w-5 h-0.5 rounded transition-all duration-200"
            style={{ backgroundColor: "var(--button-text)" }}
          ></div>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto sidebar-scrollbar">
        {menus.map((menu, i) =>
          "divider" in menu ? (
            !collapsed && (
              <p
                key={i}
                className="text-xs uppercase font-semibold mt-4 mb-2 px-4 tracking-wider"
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
                "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 min-h-[44px] relative",
                collapsed ? "justify-center px-2" : "justify-start",
                isActive(menu.path) && "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-white before:rounded-r-full before:opacity-90"
              )}
              style={{
                backgroundColor: isActive(menu.path)
                  ? "var(--sidebar-active-bg)"
                  : "transparent",
                color: isActive(menu.path)
                  ? "var(--sidebar-active-text)"
                  : "var(--button-text)",
                boxShadow: isActive(menu.path) 
                  ? "inset 0 0 10px rgba(255, 255, 255, 0.08)" 
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive(menu.path))
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                if (!isActive(menu.path))
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <menu.icon
                className={clsx(
                  "flex-shrink-0 transition-all duration-200",
                  collapsed ? "w-5 h-5" : "w-5 h-5"
                )}
                style={{
                  color: isActive(menu.path)
                    ? "var(--sidebar-active-text)"
                    : "var(--button-text)",
                }}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{menu.name}</span>
                  {menu.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white ml-2 flex-shrink-0">
                      {menu.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
};
