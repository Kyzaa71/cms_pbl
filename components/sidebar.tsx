"use client";

import { useState } from "react";
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

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Tambahkan path agar tiap menu bisa diarahkan ke page-nya
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

  return (
    <aside
      className={clsx(
        "bg-[#3B82F6] text-white flex flex-col transition-all duration-300 h-screen",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <div className="flex items-center space-x-2 font-bold">
            <div className="w-6 h-6 bg-white rounded" />
            <span>CMS Team#6</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex flex-col justify-center items-center space-y-[4px] cursor-pointer"
        >
          <div className="w-5 h-[2px] bg-white"></div>
          <div className="w-5 h-[2px] bg-white"></div>
          <div className="w-5 h-[2px] bg-white"></div>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-1">
        {menus.map((menu, i) =>
          menu.divider ? (
            !collapsed && (
              <p
                key={i}
                className="text-xs uppercase font-semibold text-white/70 mt-4 mb-2 px-2"
              >
                {menu.divider}
              </p>
            )
          ) : (
            <Link
              key={menu.name}
              href={menu.path ?? "#"}
              className={clsx(
                "flex items-center space-x-3 px-4 py-2 rounded-md transition-all",
                pathname === menu.path
                  ? "bg-[#5B4B8A]"
                  : "hover:bg-blue-500",
                collapsed ? "justify-center" : "justify-start"
              )}
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
