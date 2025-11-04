// Types for API Reference

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  auth_required: boolean;
  permission?: string;
  parameters?: Record<string, any>;
  request_body?: Record<string, any>;
  response_example?: Record<string, any>;
}

export interface APIReference {
  content_type: string;
  content_type_id: number;
  slug: string;
  description: string;
  base_url: string;
  endpoints: APIEndpoint[];
  fields: Array<Record<string, any>>;
  seo_enabled: boolean;
  created_at: string;
}

