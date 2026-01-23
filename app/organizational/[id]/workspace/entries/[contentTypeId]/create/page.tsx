"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useContentType, useContentTypes } from "@/hooks/use-content";
import { contentService } from "@/lib/services/content-service";
import { EntryForm } from "@/components/content-management/entry-form";
import type { WorkflowStatus } from "@/components/content-management/types";

export default function OrgCreateEntryPage() {
  const params = useParams();
  const router = useRouter();
  
  // params structure: { id: "2", contentTypeId: "52" }
  // id maps to project_id in organizational route
  const rawParam = params.contentTypeId as string;
  const projectIdParam = params.id as string;
  
  const projectId = projectIdParam ? parseInt(projectIdParam, 10) : null;
  
  const { data: allCTs } = useContentTypes(projectId || undefined);
  const [resolvedId, setResolvedId] = useState<number | null>(null);

  useEffect(() => {
    if (!rawParam) return;
    const isNumeric = /^\d+$/.test(rawParam);
    if (isNumeric) {
      setResolvedId(parseInt(rawParam, 10));
      return;
    }
    if (allCTs && allCTs.length > 0) {
      const found = allCTs.find((ct) => ct.slug === rawParam);
      setResolvedId(found ? found.id : null);
    }
  }, [rawParam, allCTs]);

  const { data: contentType } = useContentType(resolvedId || 0, projectId || undefined);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Record<string, unknown>, status: WorkflowStatus) => {
    try {
      if (!resolvedId) throw new Error("Content type not found");
      
      await contentService.createEntry(resolvedId, data, projectId || undefined);
      
      if (projectId) {
        // Redirect back to organizational view
        router.push(`/organizational/${projectId}/workspace/entries/${resolvedId}?project_id=${projectId}`);
      } else {
        // Fallback
        router.push(`/content-management/${resolvedId}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to create entry");
    }
  };

  const handleCancel = () => {
    if (projectId && resolvedId) {
      router.push(`/organizational/${projectId}/workspace/entries/${resolvedId}?project_id=${projectId}`);
    } else if (resolvedId) {
      router.push(`/content-management/${resolvedId}`);
    } else {
      router.push(projectId ? `/organizational/${projectId}` : `/content-management`);
    }
  };

  if (resolvedId === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Content type not found</p>
          <Button variant="outline" className="mt-4" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (!contentType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Loading content type...</p>
           <Button variant="outline" className="mt-4" onClick={handleCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create {contentType.name}</h1>
          <p className="text-muted-foreground">Fill in the details below to create a new entry.</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6 flex items-center justify-between">
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-auto p-1 text-destructive hover:bg-destructive/10">
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      )}

      <EntryForm
        contentTypeId={resolvedId}
        projectId={projectId || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
