// Helper functions for Field Validation Rules

import { ContentField } from "@/components/content-builder/types";
import { ValidationRules } from "./types";

/**
 * Generate validation rules from field data
 * In a real app, this would fetch from: GET /content/fields/:field_id/validation
 */
export function generateValidationRules(field: ContentField): ValidationRules {
  const rules: ValidationRules = {
    name: field.name,
    type: field.type,
    required: field.required,
    unique: field.unique,
  };

  if (field.minLength !== undefined) {
    rules.min_length = field.minLength;
  }
  if (field.maxLength !== undefined) {
    rules.max_length = field.maxLength;
  }
  if (field.pattern) {
    rules.pattern = field.pattern;
  }
  if (field.minValue !== undefined) {
    rules.min_value = field.minValue;
  }
  if (field.maxValue !== undefined) {
    rules.max_value = field.maxValue;
  }
  if (field.defaultValue) {
    rules.default = field.defaultValue;
  }
  if (field.placeholder) {
    rules.placeholder = field.placeholder;
  }
  if (field.helpText) {
    rules.help_text = field.helpText;
  }

  return rules;
}

/**
 * Get validation rule label
 */
export function getValidationRuleLabel(key: string): string {
  const labels: Record<string, string> = {
    name: "Field Name",
    type: "Field Type",
    required: "Required",
    unique: "Unique",
    min_length: "Minimum Length",
    max_length: "Maximum Length",
    pattern: "Pattern (Regex)",
    min_value: "Minimum Value",
    max_value: "Maximum Value",
    default: "Default Value",
    placeholder: "Placeholder",
    help_text: "Help Text",
  };
  return labels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Format validation rule value for display
 */
export function formatValidationValue(key: string, value: any): string {
  if (value === null || value === undefined) {
    return "Not set";
  }
  
  if (key === "required" || key === "unique") {
    return value ? "Yes" : "No";
  }
  
  if (key === "pattern") {
    return `/${value}/`;
  }
  
  return String(value);
}

