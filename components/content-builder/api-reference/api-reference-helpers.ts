// Helper functions for generating API Reference from dummy data

import { ContentType, ContentField } from "@/components/content-builder/types";
import { APIEndpoint, APIReference } from "./types";

export function generateAPIReference(
  contentType: ContentType,
  fields: ContentField[],
  baseURL: string
): APIReference {
  // Generate field documentation
  const fieldsDoc = fields.map((field) => {
    const doc: Record<string, any> = {
      name: field.name,
      type: field.type,
      required: field.required,
      is_seo: field.isSeo,
      unique: field.unique,
      description: `${field.name} field`,
    };

    if (field.maxLength) doc.max_length = field.maxLength;
    if (field.minLength) doc.min_length = field.minLength;
    if (field.pattern) doc.pattern = field.pattern;
    if (field.minValue) doc.min_value = field.minValue;
    if (field.maxValue) doc.max_value = field.maxValue;
    if (field.defaultValue) doc.default = field.defaultValue;

    // Generate example value
    switch (field.type) {
      case "string":
      case "text":
        doc.example = field.placeholder || `Example ${field.name}`;
        break;
      case "number":
        doc.example = field.minValue || 0;
        break;
      case "boolean":
        doc.example = false;
        break;
      case "date":
        doc.example = "2024-01-01";
        break;
      case "email":
        doc.example = "example@email.com";
        break;
      case "url":
        doc.example = "https://example.com";
        break;
      case "media":
        doc.example = { id: 1, url: "https://example.com/image.jpg" };
        break;
      default:
        doc.example = `Example ${field.name}`;
    }

    return doc;
  });

  // Generate request body example
  const requestBodyExample: Record<string, any> = {};
  fields.forEach((field) => {
    if (field.type === "boolean") {
      requestBodyExample[field.name] = false;
    } else if (field.type === "number") {
      requestBodyExample[field.name] = field.minValue || 0;
    } else if (field.type === "date") {
      requestBodyExample[field.name] = "2024-01-01";
    } else if (field.type === "email") {
      requestBodyExample[field.name] = "example@email.com";
    } else if (field.type === "url") {
      requestBodyExample[field.name] = "https://example.com";
    } else if (field.type === "media") {
      requestBodyExample[field.name] = { id: 1, url: "https://example.com/image.jpg" };
    } else {
      requestBodyExample[field.name] = field.placeholder || `Example ${field.name}`;
    }
  });

  // Generate response example
  const responseExample = {
    id: 1,
    content_type_id: contentType.id,
    data: requestBodyExample,
    status: "draft",
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Generate endpoints
  const endpoints: APIEndpoint[] = [
    {
      method: "POST",
      path: `/content/${contentType.id}/entries`,
      description: `Create a new ${contentType.name} entry`,
      auth_required: true,
      permission: "ContentEntry:create",
      request_body: requestBodyExample,
      response_example: { status: 201, data: responseExample },
    },
    {
      method: "GET",
      path: `/content/${contentType.id}/entries`,
      description: `List all ${contentType.name} entries`,
      auth_required: true,
      permission: "ContentEntry:read",
      parameters: {
        page: { type: "integer", default: 1, description: "Page number" },
        limit: { type: "integer", default: 10, description: "Items per page" },
        status: {
          type: "string",
          enum: ["draft", "in_review", "approved", "published"],
          description: "Filter by status",
        },
        created_by: { type: "integer", description: "Filter by creator user ID" },
      },
      response_example: {
        status: 200,
        data: [responseExample],
        meta: { page: 1, limit: 10, total: 1 },
      },
    },
    {
      method: "GET",
      path: "/content/entries/{entry_id}",
      description: `Get a specific ${contentType.name} entry`,
      auth_required: true,
      permission: "ContentEntry:read",
      parameters: {
        entry_id: { type: "integer", required: true, in: "path", description: "Entry ID" },
      },
      response_example: { status: 200, data: responseExample },
    },
    {
      method: "PUT",
      path: "/content/entries/{entry_id}",
      description: `Update a ${contentType.name} entry`,
      auth_required: true,
      permission: "ContentEntry:update",
      parameters: {
        entry_id: { type: "integer", required: true, in: "path", description: "Entry ID" },
      },
      request_body: requestBodyExample,
      response_example: { status: 200, data: responseExample },
    },
    {
      method: "DELETE",
      path: "/content/entries/{entry_id}",
      description: `Delete a ${contentType.name} entry (must not be published)`,
      auth_required: true,
      permission: "ContentEntry:delete",
      parameters: {
        entry_id: { type: "integer", required: true, in: "path", description: "Entry ID" },
      },
      response_example: { status: 204, body: null },
    },
  ];

  // Add SEO preview endpoint if SEO is enabled
  if (contentType.enableSeo) {
    endpoints.push({
      method: "GET",
      path: "/content/entries/{entry_id}/seo-preview",
      description: `Get SEO preview for a ${contentType.name} entry`,
      auth_required: true,
      permission: "SEO:read",
      parameters: {
        entry_id: { type: "integer", required: true, in: "path", description: "Entry ID" },
      },
      response_example: {
        status: 200,
        data: {
          title: "SEO Title",
          description: "SEO Description",
          url: "https://example.com/seo-url",
        },
      },
    });
  }

  return {
    content_type: contentType.name,
    content_type_id: contentType.id,
    slug: contentType.slug,
    description: `API Reference for ${contentType.name} content type`,
    base_url: baseURL,
    endpoints,
    fields: fieldsDoc,
    seo_enabled: contentType.enableSeo,
    created_at: contentType.createdAt,
  };
}

export function formatJSON(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

