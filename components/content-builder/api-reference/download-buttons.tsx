"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileCode, FileText, Loader2 } from "lucide-react";
import { ContentType, ContentField } from "@/components/content-builder/types";
import {
  generateOpenAPISpec,
  generateMarkdownDocs,
  downloadFile,
} from "./download-helpers";

interface DownloadButtonsProps {
  contentTypeId: number;
  contentType: ContentType;
  fields: ContentField[];
}

export function DownloadButtons({
  contentTypeId,
  contentType,
  fields,
}: DownloadButtonsProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownloadOpenAPI = async () => {
    setIsDownloading("openapi");
    try {
      // In a real app, this would fetch from: GET /content/types/:id/openapi
      const yaml = generateOpenAPISpec(contentType, fields);
      downloadFile(
        yaml,
        `${contentType.slug}-api.yaml`,
        "application/x-yaml"
      );
    } catch (error) {
      console.error("Failed to generate OpenAPI spec:", error);
      alert("Failed to download OpenAPI specification");
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDownloadMarkdown = async () => {
    setIsDownloading("markdown");
    try {
      // In a real app, this would fetch from: GET /content/types/:id/docs/markdown
      const markdown = generateMarkdownDocs(contentType, fields);
      downloadFile(
        markdown,
        `${contentType.slug}-docs.md`,
        "text/markdown"
      );
    } catch (error) {
      console.error("Failed to generate Markdown docs:", error);
      alert("Failed to download Markdown documentation");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md active:scale-[0.98] border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-inner)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
          disabled={isDownloading !== null}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-[var(--card-bg)] border border-[var(--border)] shadow-lg rounded-lg p-1.5 min-w-[200px] z-50"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={handleDownloadOpenAPI}
          disabled={isDownloading === "openapi"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-bg-inner)] focus:bg-[var(--card-bg-inner)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          {isDownloading === "openapi" ? (
            <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
          ) : (
            <FileCode className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
          )}
          <span className="flex-1">OpenAPI Spec (YAML)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDownloadMarkdown}
          disabled={isDownloading === "markdown"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-bg-inner)] focus:bg-[var(--card-bg-inner)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          {isDownloading === "markdown" ? (
            <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
          ) : (
            <FileText className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
          )}
          <span className="flex-1">Markdown Docs</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

