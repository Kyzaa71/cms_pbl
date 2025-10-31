"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, ExternalLink } from "lucide-react";

export default function OrganizationalPage() {
  const router = useRouter();

  const organizations = [
    {
      id: "ORG001",
      name: "CMS CmLabs",
      lastUpdate: "32 Minutes Ago",
      collaborators: ["Me", "JK", "AB"],
      role: "Owner",
    },
    {
      id: "ORG002",
      name: "CMS Pegadaian",
      lastUpdate: "12 Hours Ago",
      collaborators: ["AD", "RL", "ST", "GG"],
      role: "Admin",
    },
    {
      id: "ORG003",
      name: "CMS UB",
      lastUpdate: "16 Sep 2025, 15:11",
      collaborators: ["JO", "KK"],
      role: "Member",
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Organizational Project
        </h1>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search..."
            className="w-[350px] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
          />
          <Button
            className="bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[color-mix(in srgb, var(--accent) 80%, black)] px-6 font-medium"
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr
              className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left"
            >
              <th className="py-3 px-4 font-medium">Organization Name</th>
              <th className="py-3 px-4 font-medium">Last Update</th>
              <th className="py-3 px-4 font-medium">Collaborators</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody className="bg-[var(--card-bg-inner)]">
            {organizations.map((org, index) => (
              <tr
                key={org.id}
                className={`border-t border-[var(--border)] ${
                  index % 2 === 0
                    ? "bg-[var(--card-bg-inner)]"
                    : "bg-[var(--card-bg)]"
                } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
              >
                <td className="py-3 px-4">{org.name}</td>
                <td className="py-3 px-4 text-[var(--muted-foreground)]">
                  {org.lastUpdate}
                </td>

                {/* Collaborators */}
                <td className="py-3 px-4">
                  <div className="flex -space-x-3">
                    {org.collaborators.slice(0, 3).map((c, i) => (
                      <Avatar
                        key={i}
                        className="w-8 h-8 border-1 border-[var(--card-bg-inner)]"
                      >
                        <AvatarFallback className="bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold">
                          {c[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {org.collaborators.length > 3 && (
                      <span className="ml-3 text-xs text-[var(--muted-foreground)]">
                        +{org.collaborators.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                {/* Role */}
                <td className="py-3 px-4">
                  <span
                    className={`font-medium ${
                      org.role === "Owner"
                        ? "text-[var(--success)]"
                        : org.role === "Admin"
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {org.role}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                      onClick={() => console.log("delete", org.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--secondary)] hover:text-[color-mix(in srgb, var(--secondary) 80%, black)]"
                      onClick={() => router.push(`/organizational/${org.id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
