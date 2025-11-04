// Types for Field Validation Rules feature

import { ContentField } from "@/components/content-builder/types";

export interface ValidationRules {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  min_value?: number;
  max_value?: number;
  default?: string;
  placeholder?: string;
  help_text?: string;
}

export interface ValidationRulesProps {
  fieldId: number;
  contentTypeId: number;
  field?: ContentField;
}

