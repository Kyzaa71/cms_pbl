"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/services/auth-service";
import { userService } from "@/lib/services/user-service";
import type { User } from "@/types/backend-models";

export default function AccountInfoPage() {
  const router = useRouter();
  const { user: storeUser, setUser } = useAuthStore();
  const [user, setLocalUser] = useState<User | null>(storeUser);
  const [name, setName] = useState<string>(storeUser?.name || "");
  const [email, setEmail] = useState<string>(storeUser?.email || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await authService.getCurrentUser();
        setLocalUser(me);
        setUser(me);
        setName(me?.name || "");
        setEmail(me?.email || "");
      } catch {}
    };
    if (!storeUser) load();
  }, [storeUser, setUser]);

  useEffect(() => {
    if (storeUser) {
      setLocalUser(storeUser);
      setName(storeUser.name || "");
      setEmail(storeUser.email || "");
    }
  }, [storeUser]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const updated = await userService.update(user.id, { name, email });
      setLocalUser(updated);
      setUser(updated);
    } catch {}
    setSaving(false);
  };

  return (
    <div
      className="space-y-8"
      style={{ color: "var(--foreground)", backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--secondary)" }}>
            Account Information
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Manage your personal information and account preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/settings")}
            className="border rounded-lg"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--dropdown-hover-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Back
          </Button>

          <Button
            className="rounded-lg"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--button-text)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--success-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent)")
            }
            disabled={saving || !name || !email}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Account Info Card */}
      <Card
        className="p-6"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card-bg-inner)",
        }}
      >
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profile || "/avatar-placeholder.png"} alt="User avatar" />
              <AvatarFallback>
                {(user?.name || "").split(" ").map((n) => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button
                variant="outline"
                className="text-sm border rounded-lg"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Change Photo
              </Button>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                Recommended size: 400x400px, max 2MB.
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="username"
                defaultValue="john_doe"
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+62 812 3456 7890"
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-medium" style={{ color: "var(--muted-foreground)" }}>
              Change Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
