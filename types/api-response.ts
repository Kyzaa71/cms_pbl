export interface ErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

export interface StandardResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetail;
  meta?: Meta;
}

