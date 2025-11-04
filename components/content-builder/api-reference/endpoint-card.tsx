"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Lock } from "lucide-react";
import { APIEndpoint } from "./types";
import { formatJSON } from "./api-reference-helpers";

interface EndpointCardProps {
  endpoint: APIEndpoint;
  index: number;
  baseURL: string;
}

export function EndpointCard({ endpoint, index, baseURL }: EndpointCardProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(identifier);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500 text-white";
      case "POST":
        return "bg-blue-500 text-white";
      case "PUT":
        return "bg-orange-500 text-white";
      case "DELETE":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
      <div className="p-6">
        {/* Endpoint Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getMethodColor(endpoint.method)}>
                {endpoint.method}
              </Badge>
              <code className="text-sm font-mono text-[var(--foreground)] bg-[var(--card-bg-inner)] px-3 py-1 rounded">
                {endpoint.path}
              </code>
              <button
                onClick={() =>
                  handleCopy(`${baseURL}${endpoint.path}`, `endpoint-${index}`)
                }
                className="p-1.5 rounded hover:bg-[var(--hover)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                title="Copy URL"
              >
                {copiedText === `endpoint-${index}` ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {endpoint.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {endpoint.auth_required && (
              <Badge variant="outline" className="border-[var(--warning)] text-[var(--warning)] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Auth Required
              </Badge>
            )}
            {endpoint.permission && (
              <Badge variant="outline" className="border-[var(--primary)] text-[var(--primary)]">
                {endpoint.permission}
              </Badge>
            )}
          </div>
        </div>

        {/* Parameters */}
        {endpoint.parameters && Object.keys(endpoint.parameters).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">
              Parameters
            </h4>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead className="bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-xs">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-xs">Type</th>
                    <th className="px-3 py-2 text-left font-medium text-xs">Required</th>
                    <th className="px-3 py-2 text-left font-medium text-xs">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(endpoint.parameters).map(([key, value]: [string, any]) => (
                    <tr
                      key={key}
                      className="border-t border-[var(--border)] bg-[var(--card-bg-inner)]"
                    >
                      <td className="px-3 py-2">
                        <code className="text-xs text-[var(--foreground)]">{key}</code>
                      </td>
                      <td className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
                        {value.type || "string"}
                      </td>
                      <td className="px-3 py-2">
                        {value.required ? (
                          <Badge className="bg-[var(--success)] text-white text-xs">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-xs text-[var(--muted-foreground)]">No</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
                        {value.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Body */}
        {endpoint.request_body && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Request Body
              </h4>
              <button
                onClick={() =>
                  handleCopy(formatJSON(endpoint.request_body), `request-${index}`)
                }
                className="p-1.5 rounded hover:bg-[var(--hover)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 text-xs"
              >
                {copiedText === `request-${index}` ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy JSON
                  </>
                )}
              </button>
            </div>
            <div className="bg-[var(--card-bg-inner)] border border-[var(--border)] rounded p-4 overflow-x-auto custom-scrollbar">
              <pre className="text-xs font-mono text-[var(--foreground)] whitespace-pre-wrap">
                {formatJSON(endpoint.request_body)}
              </pre>
            </div>
          </div>
        )}

        {/* Response Example */}
        {endpoint.response_example && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Response Example
              </h4>
              <button
                onClick={() =>
                  handleCopy(formatJSON(endpoint.response_example), `response-${index}`)
                }
                className="p-1.5 rounded hover:bg-[var(--hover)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 text-xs"
              >
                {copiedText === `response-${index}` ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy JSON
                  </>
                )}
              </button>
            </div>
            <div className="bg-[var(--card-bg-inner)] border border-[var(--border)] rounded p-4 overflow-x-auto custom-scrollbar">
              <pre className="text-xs font-mono text-[var(--foreground)] whitespace-pre-wrap">
                {formatJSON(endpoint.response_example)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

