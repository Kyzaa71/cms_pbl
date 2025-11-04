"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, AlertCircle } from "lucide-react";
import { SEOPreviewData } from "./types";
import { validateSEOData } from "./seo-preview-helpers";

interface SEOPreviewMetadataProps {
  data: SEOPreviewData;
}

export function SEOPreviewMetadata({ data }: SEOPreviewMetadataProps) {
  const validation = validateSEOData(data);

  const metadataFields = [
    { label: "Meta Title", key: "meta_title", type: "text" },
    { label: "Meta Description", key: "meta_description", type: "text" },
    { label: "Meta Image", key: "meta_image", type: "url" },
    { label: "Slug", key: "slug", type: "text" },
    { label: "Canonical URL", key: "canonical_url", type: "url" },
    { label: "SEO Keywords", key: "seo_keywords", type: "array" },
    { label: "OG Title", key: "og_title", type: "text" },
    { label: "OG Description", key: "og_description", type: "text" },
    { label: "OG Image", key: "og_image", type: "url" },
    { label: "Twitter Title", key: "twitter_title", type: "text" },
    { label: "Twitter Description", key: "twitter_description", type: "text" },
    { label: "Twitter Image", key: "twitter_image", type: "url" },
    { label: "Twitter Card Type", key: "twitter_card", type: "text" },
  ];

  return (
    <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            SEO Metadata
          </h3>
        </div>
        {validation.isValid ? (
          <Badge className="bg-[var(--success)] text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Valid
          </Badge>
        ) : (
          <Badge variant="outline" className="border-[var(--danger)] text-[var(--danger)]">
            <AlertCircle className="w-3 h-3 mr-1" />
            {validation.warnings.length} Warning(s)
          </Badge>
        )}
      </div>

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                SEO Optimization Recommendations:
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1 list-disc list-inside">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 font-semibold text-[var(--foreground)]">
                Field
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--foreground)]">
                Value
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--foreground)]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {metadataFields.map((field) => {
              const value = data[field.key];
              const hasValue = value !== undefined && value !== null && value !== "";
              
              let displayValue: string = "";
              if (field.type === "array" && Array.isArray(value)) {
                displayValue = value.join(", ");
              } else if (value) {
                displayValue = String(value);
              }

              return (
                <tr
                  key={field.key}
                  className="border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-[var(--foreground)]">
                    {field.label}
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">
                    {hasValue ? (
                      <div className="max-w-md">
                        {field.type === "url" && value ? (
                          <a
                            href={String(value)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--primary)] hover:underline break-all"
                          >
                            {displayValue}
                          </a>
                        ) : (
                          <span className="break-words">{displayValue}</span>
                        )}
                      </div>
                    ) : (
                      <span className="italic text-[var(--muted-foreground)]">
                        Not set
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {hasValue ? (
                      <Badge className="bg-[var(--success)] text-white text-xs">
                        Set
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Missing
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

