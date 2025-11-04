// Helper functions for generating OpenAPI and Markdown documentation downloads

import { ContentType, ContentField } from "@/components/content-builder/types";

/**
 * Generate OpenAPI YAML specification for a content type
 * In a real app, this would fetch from: GET /content/types/:id/openapi
 */
export function generateOpenAPISpec(
  contentType: ContentType,
  fields: ContentField[]
): string {
  const baseURL = typeof window !== "undefined" ? window.location.origin : "https://api.example.com";
  
  const yaml = `openapi: 3.0.3
info:
  title: ${contentType.name} API
  description: API endpoints for managing ${contentType.name} content entries
  version: 1.0.0
servers:
  - url: ${baseURL}
    description: API Server
paths:
  /content/${contentType.id}/entries:
    get:
      summary: List ${contentType.name} entries
      tags:
        - ${contentType.name}
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, in_review, ready_for_approval, approved, published, rejected]
      responses:
        '200':
          description: List of entries
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/${contentType.name}Entry'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    post:
      summary: Create a new ${contentType.name} entry
      tags:
        - ${contentType.name}
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/${contentType.name}CreateRequest'
      responses:
        '201':
          description: Entry created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/${contentType.name}Entry'

  /content/entries/{entry_id}:
    get:
      summary: Get a ${contentType.name} entry by ID
      tags:
        - ${contentType.name}
      security:
        - bearerAuth: []
      parameters:
        - name: entry_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Entry details
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/${contentType.name}Entry'
    
    put:
      summary: Update a ${contentType.name} entry
      tags:
        - ${contentType.name}
      security:
        - bearerAuth: []
      parameters:
        - name: entry_id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/${contentType.name}UpdateRequest'
      responses:
        '200':
          description: Entry updated successfully
    
    delete:
      summary: Delete a ${contentType.name} entry
      tags:
        - ${contentType.name}
      security:
        - bearerAuth: []
      parameters:
        - name: entry_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: Entry deleted successfully

${contentType.enableSeo ? `  /content/entries/{entry_id}/seo-preview:
    get:
      summary: Get SEO preview for a ${contentType.name} entry
      tags:
        - ${contentType.name}
      security:
        - bearerAuth: []
      parameters:
        - name: entry_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: SEO preview data
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/SEOPreview'
` : ""}
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    PaginationMeta:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        total_pages:
          type: integer

    ${contentType.name}Entry:
      type: object
      properties:
        id:
          type: integer
        content_type_id:
          type: integer
        data:
          type: object
        status:
          type: string
          enum: [draft, in_review, ready_for_approval, approved, published, rejected]
        created_by:
          type: integer
        updated_by:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        published_at:
          type: string
          format: date-time
          nullable: true

    ${contentType.name}CreateRequest:
      type: object
      required: ${generateRequiredFields(fields)}
      properties:
${generatePropertiesYAML(fields)}

    ${contentType.name}UpdateRequest:
      type: object
      properties:
${generatePropertiesYAML(fields)}

${contentType.enableSeo ? `    SEOPreview:
      type: object
      properties:
        meta_title:
          type: string
        meta_description:
          type: string
        meta_image:
          type: string
        slug:
          type: string
` : ""}`;

  return yaml;
}

/**
 * Generate Markdown documentation for a content type
 * In a real app, this would fetch from: GET /content/types/:id/docs/markdown
 */
export function generateMarkdownDocs(
  contentType: ContentType,
  fields: ContentField[]
): string {
  const baseURL = typeof window !== "undefined" ? window.location.origin : "https://api.example.com";
  
  let markdown = `# ${contentType.name} API Documentation\n\n`;
  markdown += `**Base URL:** \`${baseURL}\`\n\n`;
  markdown += `**Content Type ID:** \`${contentType.id}\`\n\n`;
  markdown += `**Slug:** \`${contentType.slug}\`\n\n`;
  
  if (contentType.enableSeo) {
    markdown += `**SEO Enabled:** ✓\n\n`;
  }
  
  markdown += `---\n\n`;
  markdown += `## Fields\n\n`;
  markdown += `| Field | Type | Required | Unique | Validation Rules |\n`;
  markdown += `|-------|------|----------|--------|------------------|\n`;
  
  fields.forEach((field) => {
    const required = field.required ? "✓" : "✗";
    const unique = field.unique ? "✓" : "✗";
    
    const validation = [];
    if (field.minLength) validation.push(`min: ${field.minLength}`);
    if (field.maxLength) validation.push(`max: ${field.maxLength}`);
    if (field.minValue !== undefined) validation.push(`min: ${field.minValue}`);
    if (field.maxValue !== undefined) validation.push(`max: ${field.maxValue}`);
    if (field.pattern) validation.push(`pattern: \`${field.pattern}\``);
    
    const validationStr = validation.length > 0 ? validation.join(", ") : "-";
    const fieldType = field.isSeo ? `${field.type} (SEO)` : field.type;
    
    markdown += `| \`${field.name}\` | ${fieldType} | ${required} | ${unique} | ${validationStr} |\n`;
  });
  
  markdown += `\n## Endpoints\n\n`;
  
  // CREATE
  markdown += `### Create Entry\n\n`;
  markdown += `**POST** \`/content/${contentType.id}/entries\`\n\n`;
  markdown += `**Authentication:** Required (Bearer Token)\n\n`;
  markdown += `**Permission:** \`ContentEntry:create\`\n\n`;
  markdown += `**Request Body:**\n\n`;
  markdown += `\`\`\`json\n`;
  markdown += `${JSON.stringify(generateExampleRequestBody(fields), null, 2)}\n`;
  markdown += `\`\`\`\n\n`;
  
  // LIST
  markdown += `### List Entries\n\n`;
  markdown += `**GET** \`/content/${contentType.id}/entries\`\n\n`;
  markdown += `**Authentication:** Required (Bearer Token)\n\n`;
  markdown += `**Permission:** \`ContentEntry:read\`\n\n`;
  markdown += `**Query Parameters:**\n\n`;
  markdown += `- \`page\` (integer, default: 1) - Page number\n`;
  markdown += `- \`limit\` (integer, default: 10) - Items per page\n`;
  markdown += `- \`status\` (string) - Filter by status\n`;
  markdown += `- \`created_by\` (integer) - Filter by creator user ID\n`;
  markdown += `- \`from\` (date) - Filter from date (YYYY-MM-DD)\n`;
  markdown += `- \`to\` (date) - Filter to date (YYYY-MM-DD)\n\n`;
  
  // GET BY ID
  markdown += `### Get Entry by ID\n\n`;
  markdown += `**GET** \`/content/entries/{entry_id}\`\n\n`;
  markdown += `**Authentication:** Required (Bearer Token)\n\n`;
  markdown += `**Permission:** \`ContentEntry:read\`\n\n`;
  
  // UPDATE
  markdown += `### Update Entry\n\n`;
  markdown += `**PUT** \`/content/entries/{entry_id}\`\n\n`;
  markdown += `**Authentication:** Required (Bearer Token)\n\n`;
  markdown += `**Permission:** \`ContentEntry:update\`\n\n`;
  markdown += `**Note:** Status is automatically set to \`draft\` on update.\n\n`;
  
  // DELETE
  markdown += `### Delete Entry\n\n`;
  markdown += `**DELETE** \`/content/entries/{entry_id}\`\n\n`;
  markdown += `**Authentication:** Required (Bearer Token)\n\n`;
  markdown += `**Permission:** \`ContentEntry:delete\`\n\n`;
  markdown += `**Note:** Cannot delete published entries. Unpublish first.\n\n`;
  
  if (contentType.enableSeo) {
    markdown += `### SEO Preview\n\n`;
    markdown += `**GET** \`/content/entries/{entry_id}/seo-preview\`\n\n`;
    markdown += `**Authentication:** Required (Bearer Token)\n\n`;
    markdown += `**Permission:** \`SEO:read\`\n\n`;
  }
  
  markdown += `---\n\n`;
  markdown += `## Authentication\n\n`;
  markdown += `All endpoints require a Bearer token in the Authorization header:\n\n`;
  markdown += `\`\`\`\n`;
  markdown += `Authorization: Bearer <your_jwt_token>\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `Obtain a token by authenticating at \`/auth/login\`\n\n`;
  
  return markdown;
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper functions for generating request examples
function generateRequiredFields(fields: ContentField[]): string {
  const required = fields.filter(f => f.required).map(f => `"${f.name}"`);
  return required.length > 0 ? `[${required.join(", ")}]` : "[]";
}

function generatePropertiesYAML(fields: ContentField[]): string {
  return fields.map(field => {
    const type = mapFieldTypeToOpenAPI(field.type);
    return `        ${field.name}:
          type: ${type}
          ${field.required ? "required: true" : ""}
          ${field.helpText ? `description: ${field.helpText}` : ""}`;
  }).join("\n");
}

function mapFieldTypeToOpenAPI(type: string): string {
  const typeMap: Record<string, string> = {
    string: "string",
    text: "string",
    number: "number",
    boolean: "boolean",
    date: "string",
    email: "string",
    url: "string",
    media: "string",
  };
  return typeMap[type] || "string";
}

function generateExampleRequestBody(fields: ContentField[]): Record<string, any> {
  const example: Record<string, any> = {};
  fields.forEach(field => {
    example[field.name] = generateFieldExample(field);
  });
  return example;
}

function generateFieldExample(field: ContentField): any {
  switch (field.type) {
    case "string":
    case "text":
    case "email":
    case "url":
      return field.defaultValue || `Example ${field.name}`;
    case "number":
      return field.defaultValue || 0;
    case "boolean":
      return field.defaultValue === "true" || false;
    case "date":
      return field.defaultValue || new Date().toISOString().split("T")[0];
    case "media":
      return field.defaultValue || "https://example.com/image.jpg";
    default:
      return field.defaultValue || null;
  }
}

