export type WorkflowStatus =
  | "draft"
  | "in_review"
  | "ready_for_approval"
  | "approved"
  | "published"
  | "rejected";

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  role_id: number;
  module: string;
  action: string;
  field_scope?: string;
  allowed_fields?: unknown;
  denied_fields?: unknown;
  content_type_ids?: unknown;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
  status: string;
  role_id: number;
  role?: Role;
  profile?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentType {
  id: number;
  name: string;
  slug: string;
  enable_seo: boolean;
  fields: ContentField[];
  seo_fields: ContentField[];
  created_at: string;
  updated_at: string;
}

export interface ContentField {
  id: number;
  content_type_id: number;
  name: string;
  type: string;
  required: boolean;
  is_seo: boolean;
  unique: boolean;
  max_length?: number;
  min_length?: number;
  pattern?: string;
  min_value?: number;
  max_value?: number;
  default_value?: string;
  placeholder?: string;
  help_text?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentEntry {
  id: number;
  content_type_id: number;
  data: unknown;
  status: WorkflowStatus;
  created_by?: number;
  updated_by?: number;
  creator?: User;
  updater?: User;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ContentRelation {
  id: number;
  from_content_id: number;
  to_content_id: number;
  relation_type: string;
  created_at: string;
  updated_at: string;
}

export interface MediaFile {
  id: number;
  file_name: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  folder: string;
  tags?: unknown;
  alt: string;
  caption: string;
  uploaded_by: number;
  uploader?: User;
  created_at: string;
  updated_at: string;
}

export interface MediaFolder {
  id: number;
  name: string;
  path: string;
  parent_id?: number;
  parent?: MediaFolder;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTransition {
  id: number;
  from_status: WorkflowStatus;
  to_status: WorkflowStatus;
  required_role: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowHistory {
  id: number;
  entry_id: number;
  entry?: ContentEntry;
  from_status: WorkflowStatus;
  to_status: WorkflowStatus;
  changed_by: number;
  user?: User;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowComment {
  id: number;
  entry_id: number;
  entry?: ContentEntry;
  user_id: number;
  user?: User;
  comment: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowAssignment {
  id: number;
  entry_id: number;
  entry?: ContentEntry;
  assigned_to: number;
  user?: User;
  assigned_by: number;
  assigner?: User;
  status: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

