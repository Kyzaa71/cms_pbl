"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { ValidationRules } from "./types";
import { getValidationRuleLabel, formatValidationValue } from "./validation-helpers";

interface ValidationViewerProps {
  rules: ValidationRules;
}

export function ValidationViewer({ rules }: ValidationViewerProps) {
  const ruleEntries = Object.entries(rules).filter(([key]) => key !== "name" && key !== "type");

  const getRuleStatus = (key: string, value: any): "set" | "not-set" => {
    if (key === "required" || key === "unique") {
      return value ? "set" : "not-set";
    }
    return value !== null && value !== undefined && value !== "" ? "set" : "not-set";
  };

  return (
    <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-[var(--border)] bg-[var(--card-bg-inner)]">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2.5 bg-[var(--primary)]/10 rounded-lg flex-shrink-0">
            <Info className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              Validation Rules
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Rules and constraints for field: <span className="font-medium text-[var(--foreground)]">{rules.name}</span>
            </p>
          </div>
        </div>
        
        {/* Field Metadata Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="outline" 
            className="text-xs border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)]"
          >
            Type: <span className="font-medium ml-1 text-[var(--foreground)]">{rules.type}</span>
          </Badge>
          {rules.required && (
            <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 text-xs font-medium">
              Required
            </Badge>
          )}
          {rules.unique && (
            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs font-medium">
              Unique
            </Badge>
          )}
        </div>
      </div>

      {/* Table Section */}
      {ruleEntries.length > 0 ? (
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--table-header-bg)] hover:bg-[var(--table-header-bg)]">
                <TableHead className="text-[var(--table-header-text)] font-semibold w-[30%]">
                  Rule
                </TableHead>
                <TableHead className="text-[var(--table-header-text)] font-semibold w-[50%]">
                  Value
                </TableHead>
                <TableHead className="text-[var(--table-header-text)] font-semibold w-[20%]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ruleEntries.map(([key, value], index) => {
                const status = getRuleStatus(key, value);
                const displayValue = formatValidationValue(key, value);
                
                return (
                  <TableRow 
                    key={key} 
                    className="hover:bg-[var(--hover)] transition-colors border-b border-[var(--border)] last:border-b-0"
                  >
                    <TableCell className="font-medium text-[var(--foreground)] py-4">
                      {getValidationRuleLabel(key)}
                    </TableCell>
                    <TableCell className="text-[var(--muted-foreground)] py-4">
                      {key === "pattern" ? (
                        <code className="px-2.5 py-1.5 bg-[var(--card-bg)] border border-[var(--border)] rounded text-sm font-mono text-[var(--foreground)]">
                          {displayValue}
                        </code>
                      ) : (
                        <span className="break-all text-[var(--foreground)]">{displayValue}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      {status === "set" ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 flex items-center gap-1.5 w-fit px-2 py-1 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Set
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 flex items-center gap-1.5 w-fit px-2 py-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Not Set
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-12 text-center border-t border-[var(--border)]">
          <AlertCircle className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            No validation rules configured
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            This field has no additional validation constraints
          </p>
        </div>
      )}
    </Card>
  );
}

