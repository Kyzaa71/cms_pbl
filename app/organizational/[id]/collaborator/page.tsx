"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CollaboratorsPage() {
  const [search, setSearch] = useState("");

  const collaborators = [
    { name: "Bayu Yuyu", role: "Owner", status: "Active", tag: "Owner" },
    { name: "Wawan Awan", role: "Collaborator", status: "Active", tag: "Collaborator" },
    { name: "Udin Din Din", role: "Collaborator", status: "Active", tag: "Collaborator" },
    { name: "Mamat Rahmat", role: "Collaborator", status: "Pending", tag: "Collaborator" },
  ];

  const filtered = collaborators.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[var(--foreground)] bg-[var(--background)] transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Collaborator</h1>
      </div>

      {/* Search + Add */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
          />
          <span className="absolute left-2 top-2.5 text-[var(--muted-foreground)]">🔍</span>
        </div>
        <Button className="bg-[var(--accent)] hover:bg-[color-mix(in srgb, var(--accent) 85%, black)] text-[var(--accent-text)] font-medium">
          Add Collaborator
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">Collaborator Name</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((col, i) => (
              <tr
                key={i}
                className={`border-t border-[var(--border)] ${
                  i % 2 === 0 ? "bg-[var(--card-bg-inner)]" : "bg-[var(--card-bg)]"
                } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
              >
                {/* Name */}
                <td className="py-3 px-4">{col.name}</td>

                {/* Status */}
                <td className="py-3 px-4">
                  {col.status === "Active" ? (
                    <Badge className="bg-[color-mix(in srgb, var(--primary) 20%, white)] text-[var(--primary)] border-none">
                      {col.status}
                    </Badge>
                  ) : (
                    <Badge className="bg-[color-mix(in srgb, var(--success) 25%, white)] text-[var(--success)] border-none">
                      {col.status}
                    </Badge>
                  )}
                </td>

                {/* Role */}
                <td className="py-3 px-4">
                  {col.tag === "Owner" ? (
                    <Badge className="bg-[var(--primary)] text-[var(--button-text)] border-none">
                      {col.tag}
                    </Badge>
                  ) : (
                    <Badge className="bg-[var(--secondary)] text-[var(--button-text)] border-none">
                      {col.tag}
                    </Badge>
                  )}
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    {col.status === "Pending" ? (
                      <Send className="w-4 h-4 text-[var(--accent)] cursor-pointer hover:text-[color-mix(in srgb, var(--accent) 70%, black)]" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-[var(--danger)] cursor-pointer hover:text-[color-mix(in srgb, var(--danger) 75%, black)]" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
