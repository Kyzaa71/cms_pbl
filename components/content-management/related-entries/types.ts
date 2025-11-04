// Types for Related Entries feature

import { WorkflowStatus } from "@/components/content-management/types";

export type RelationType =
  | "belongs_to"
  | "has_many"
  | "has_one"
  | "many_to_many"
  | "related";

export interface RelatedEntry {
  id: number;
  contentTypeId: number;
  contentType: {
    id: number;
    name: string;
    slug: string;
  };
  title: string;
  excerpt?: string;
  description?: string;
  status: WorkflowStatus;
  relationType: RelationType;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RelatedEntriesProps {
  entryId: number;
  contentTypeId: number;
  relationType?: RelationType;
  limit?: number;
}

export interface RelatedEntriesData {
  entries: RelatedEntry[];
  total: number;
  relationType?: RelationType;
}

