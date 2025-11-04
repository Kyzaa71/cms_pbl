"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  getContentTypeById,
  getFieldsByContentTypeId,
  ContentType,
  ContentField,
} from "@/components/content-builder/types";
import { generateAPIReference } from "@/components/content-builder/api-reference/api-reference-helpers";
import { APIReference } from "@/components/content-builder/api-reference/types";
import { APIInfoCard } from "@/components/content-builder/api-reference/api-info-card";
import { FieldsTable } from "@/components/content-builder/api-reference/fields-table";
import { EndpointCard } from "@/components/content-builder/api-reference/endpoint-card";
import { APIReferenceFooter } from "@/components/content-builder/api-reference/api-reference-footer";
import { DownloadButtons } from "@/components/content-builder/api-reference/download-buttons";

export default function APIReferencePage() {
  const params = useParams();
  const contentTypeId = parseInt(params.id as string);

  const [contentType, setContentType] = useState<ContentType | undefined>();
  const [fields, setFields] = useState<ContentField[]>([]);
  const [apiRef, setApiRef] = useState<APIReference | null>(null);

  useEffect(() => {
    const ct = getContentTypeById(contentTypeId);
    setContentType(ct);

    if (ct) {
      const fieldsData = getFieldsByContentTypeId(contentTypeId);
      setFields(fieldsData);

      // Generate API Reference from dummy data
      // In a real app, this would fetch from: GET /content/types/:id/api-reference
      const baseURL = typeof window !== "undefined" ? window.location.origin : "https://api.example.com";
      const generatedRef = generateAPIReference(ct, fieldsData, baseURL);
      setApiRef(generatedRef);
    }
  }, [contentTypeId]);

  if (!contentType || !apiRef) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Link href="/content-builder">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Types
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/content-builder/${contentTypeId}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              API Reference
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              {contentType.name} - API Documentation
            </p>
          </div>
        </div>
        <DownloadButtons
          contentTypeId={contentTypeId}
          contentType={contentType}
          fields={fields}
        />
      </div>

      {/* Info Card */}
      <APIInfoCard apiRef={apiRef} />

      {/* Fields Documentation */}
      <FieldsTable apiRef={apiRef} />

      {/* Endpoints Documentation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          API Endpoints
        </h3>

        {apiRef.endpoints.map((endpoint, index) => (
          <EndpointCard
            key={index}
            endpoint={endpoint}
            index={index}
            baseURL={apiRef.base_url}
          />
        ))}
      </div>

      {/* Footer Note */}
      <APIReferenceFooter apiRef={apiRef} />
    </div>
  );
}
