"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  UserPlus,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "update",
      title: "Project CMS CmLabs Updated",
      message: "The CMS CmLabs project has been modified recently.",
      time: "32 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "collaborator",
      title: "New Collaborator Added",
      message: "JK added you as a collaborator in CMS Pegadaian.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "delete",
      title: "Project Deleted",
      message: "The CMS UB project was removed by an admin.",
      time: "12 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "edit",
      title: "Project Details Changed",
      message: "Budget Tracker project info has been updated.",
      time: "1 day ago",
      read: false,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "update":
        return <Bell className="w-6 h-6 text-[var(--primary)]" />;
      case "collaborator":
        return <UserPlus className="w-6 h-6 text-[var(--success)]" />;
      case "delete":
        return <Trash2 className="w-6 h-6 text-[var(--danger)]" />;
      case "edit":
        return <Edit3 className="w-6 h-6 text-[var(--accent)]" />;
      default:
        return <Bell className="w-6 h-6 text-[var(--muted-foreground)]" />;
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-[var(--foreground)]">
          <Bell className="w-6 h-6 text-[var(--accent)]" /> Notifications
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read: true }))
            )
          }
          className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-hover)] hover:text-[var(--button-text)]"
        >
          Mark All as Read
        </Button>
      </div>

      {/* Notification Cards */}
      <div className="flex flex-col gap-4 px-6 pb-6">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`flex items-center justify-between p-5 transition w-full rounded-xl shadow-sm border
              ${
                notif.read
                  ? "bg-[var(--card-bg)] border-[var(--border)]"
                  : "bg-[var(--card-bg-inner)] border-[var(--primary)]"
              }
              hover:bg-[var(--sidebar-hover)]`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div>{getIcon(notif.type)}</div>
              <p
                className={`text-sm truncate ${
                  notif.read
                    ? "text-[var(--muted-foreground)]"
                    : "text-[var(--foreground)] font-medium"
                }`}
              >
                <span className="font-semibold">{notif.title}</span> —{" "}
                <span className="text-[var(--muted-foreground)]">
                  {notif.message}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4 pl-4 shrink-0">
              <span className="text-xs text-[var(--muted-foreground)]">
                {notif.time}
              </span>
              {!notif.read ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notif.id);
                  }}
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-hover)] hover:text-[var(--button-text)]"
                >
                  Mark as Read
                </Button>
              ) : (
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
              )}
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <div className="text-center text-[var(--muted-foreground)] py-10">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
}
