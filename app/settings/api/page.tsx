"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ApiPage() {
  const router = useRouter();

  const tokens = [
    {
      name: "Full access",
      description: "A master API token with a full access",
      created: "March 08, 2025 08:00:17 WIB",
      lastUsed: "June 11, 2025 08:00:17 WIB",
      expires: "April 08, 2025 08:00:17 WIB",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--card-bg-mid)]">
          API and Integration
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Optimize your API and Integration management
        </p>
      </div>

      {/* Table Card */}
      <Card className="shadow-md border border-[var(--border)] bg-[var(--card-bg-inner)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[var(--foreground)]">
            API Tokens
          </CardTitle>
          <Button
            onClick={() => router.push("/settings/api/create")}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)]"
          >
            <Plus className="mr-2 h-4 w-4" /> New API token
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border border-[var(--border)]">
            <table className="w-full border-collapse text-sm">
              {/* === TABLE HEADER === */}
              <thead className="bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Description</th>
                  <th className="py-3 px-4 text-left font-semibold">Created</th>
                  <th className="py-3 px-4 text-left font-semibold">Last Used</th>
                  <th className="py-3 px-4 text-left font-semibold">Expires</th>
                  <th className="py-3 px-4 text-center font-semibold">Action</th>
                </tr>
              </thead>

              {/* === TABLE BODY === */}
              <tbody>
                {tokens.map((token, i) => (
                  <tr
                    key={i}
                    className={`text-[var(--foreground)] ${
                      i % 2 === 0
                        ? "bg-[var(--card-bg-inner)]"
                        : "bg-[var(--card-bg)]"
                    } hover:bg-[var(--dropdown-hover-bg)] transition`}
                  >
                    <td className="py-3 px-4">{token.name}</td>
                    <td className="py-3 px-4">{token.description}</td>
                    <td className="py-3 px-4">{token.created}</td>
                    <td className="py-3 px-4">{token.lastUsed}</td>
                    <td className="py-3 px-4">{token.expires}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-[var(--dropdown-hover-bg)]"
                        >
                          <Pencil className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-[var(--dropdown-hover-bg)]"
                        >
                          <Trash2 className="h-4 w-4 text-[var(--danger)]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
