"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APIReference } from "./types";

interface FieldsTableProps {
  apiRef: APIReference;
}

export function FieldsTable({ apiRef }: FieldsTableProps) {
  return (
    <Card className="border border-[var(--border)] bg-[var(--card-bg)]">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Fields
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Required</th>
                <th className="px-4 py-3 text-left font-medium">Unique</th>
                <th className="px-4 py-3 text-left font-medium">Validation</th>
                <th className="px-4 py-3 text-left font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              {apiRef.fields.map((field, index) => (
                <tr
                  key={index}
                  className={`border-t border-[var(--border)] ${
                    index % 2 === 0
                      ? "bg-[var(--card-bg-inner)]"
                      : "bg-[var(--card-bg)]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <code className="text-xs bg-[var(--card-bg-inner)] px-2 py-1 rounded text-[var(--foreground)]">
                      {field.name}
                    </code>
                    {field.is_seo && (
                      <Badge variant="outline" className="ml-2 text-xs border-[var(--success)] text-[var(--success)]">
                        SEO
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground)]">{field.type}</td>
                  <td className="px-4 py-3">
                    {field.required ? (
                      <Badge className="bg-[var(--success)] text-white text-xs">Yes</Badge>
                    ) : (
                      <span className="text-[var(--muted-foreground)]">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {field.unique ? (
                      <Badge className="bg-[var(--primary)] text-white text-xs">Yes</Badge>
                    ) : (
                      <span className="text-[var(--muted-foreground)]">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] text-xs">
                    {field.min_length && `min: ${field.min_length}`}
                    {field.min_length && field.max_length && ", "}
                    {field.max_length && `max: ${field.max_length}`}
                    {field.pattern && ` pattern: ${field.pattern}`}
                    {!field.min_length && !field.max_length && !field.pattern && "-"}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-[var(--muted-foreground)]">
                      {typeof field.example === "string"
                        ? field.example
                        : JSON.stringify(field.example)}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

