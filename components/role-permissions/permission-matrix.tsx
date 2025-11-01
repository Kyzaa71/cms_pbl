"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldScopeSelector } from "./field-scope-selector";
import { CustomFieldEditor } from "./custom-field-editor";
import { ContentTypeSelector } from "./content-type-selector";
import {
  Permission,
  MODULES,
  ACTIONS,
  getPermissionLabel,
  getAvailableActions,
} from "./types";
import { Settings2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PermissionMatrixProps {
  permissions: Permission[];
  onChange: (permissions: Permission[]) => void;
}

export function PermissionMatrix({ permissions, onChange }: PermissionMatrixProps) {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [editingPermission, setEditingPermission] = useState<{
    module: Permission["module"];
    action: Permission["action"];
  } | null>(null);

  const togglePermission = (
    module: Permission["module"],
    action: Permission["action"]
  ) => {
    const existing = permissions.find(
      (p) => p.module === module && p.action === action
    );

    if (existing) {
      // Remove permission
      onChange(permissions.filter((p) => !(p.module === module && p.action === action)));
      setExpandedCells(new Set());
      setEditingPermission(null);
    } else {
      // Add permission with default fieldScope
      const newPermission: Permission = {
        module,
        action,
        fieldScope: module === "ContentEntry" ? "all" : undefined,
      };
      onChange([...permissions, newPermission]);
    }
  };

  const updatePermission = (
    module: Permission["module"],
    action: Permission["action"],
    updates: Partial<Permission>
  ) => {
    onChange(
      permissions.map((p) => {
        if (p.module === module && p.action === action) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
  };

  const removePermission = (module: Permission["module"], action: Permission["action"]) => {
    onChange(permissions.filter((p) => !(p.module === module && p.action === action)));
    setExpandedCells(new Set());
    setEditingPermission(null);
  };

  const toggleCellExpansion = (module: Permission["module"], action: Permission["action"]) => {
    const key = `${module}-${action}`;
    const newSet = new Set(expandedCells);
    if (newSet.has(key)) {
      newSet.delete(key);
      setEditingPermission(null);
    } else {
      newSet.add(key);
      setEditingPermission({ module, action });
    }
    setExpandedCells(newSet);
  };

  const hasPermission = (module: Permission["module"], action: Permission["action"]): boolean => {
    return permissions.some((p) => p.module === module && p.action === action);
  };

  const getPermission = (
    module: Permission["module"],
    action: Permission["action"]
  ): Permission | undefined => {
    return permissions.find((p) => p.module === module && p.action === action);
  };

  const isCellExpanded = (module: Permission["module"], action: Permission["action"]): boolean => {
    return expandedCells.has(`${module}-${action}`);
  };

  return (
    <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)]">
      <CardHeader>
        <CardTitle className="text-[var(--foreground)]">Permission Matrix</CardTitle>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Configure permissions by selecting modules and actions. Click the settings icon to configure advanced options.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
                <th className="py-3 px-4 text-left font-semibold sticky left-0 bg-[var(--table-header-bg)] z-10">
                  Module
                </th>
                {ACTIONS.map((action) => (
                  <th
                    key={action}
                    className="py-3 px-4 text-center font-semibold min-w-[120px]"
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((module, moduleIdx) => {
                const availableActions = getAvailableActions(module);
                return (
                  <tr
                    key={module}
                    className={`border-t border-[var(--border)] ${
                      moduleIdx % 2 === 0
                        ? "bg-[var(--card-bg-inner)]"
                        : "bg-[var(--card-bg)]"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-[var(--foreground)] sticky left-0 bg-inherit z-10">
                      {module === "ContentEntry"
                        ? "Content Entry"
                        : module}
                    </td>
                    {ACTIONS.map((action) => {
                      const isAvailable = availableActions.includes(action);
                      const isChecked = isAvailable && hasPermission(module, action);
                      const permission = getPermission(module, action);
                      const isExpanded = isCellExpanded(module, action);

                      return (
                        <td key={action} className="py-3 px-4 text-center">
                          {isAvailable ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => togglePermission(module, action)}
                                  className="border-[var(--border)]"
                                />
                                {isChecked && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => toggleCellExpansion(module, action)}
                                    title="Configure permission"
                                  >
                                    <Settings2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {isChecked && permission && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-[var(--border)]"
                                >
                                  {permission.fieldScope
                                    ? getFieldScopeLabel(permission.fieldScope)
                                    : "All"}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-[var(--muted-foreground)] text-xs">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expanded Configuration Panels */}
        {expandedCells.size > 0 && editingPermission && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            {MODULES.map((module) =>
              getAvailableActions(module).map((action) => {
                if (!isCellExpanded(module, action)) return null;

                const permission = getPermission(module, action);
                if (!permission) return null;

                return (
                  <div
                    key={`${module}-${action}`}
                    className="space-y-4 p-4 bg-[var(--card-bg)] rounded-md mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[var(--foreground)]">
                          {getPermissionLabel(module, action)}
                        </h4>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Configure advanced permission settings
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          toggleCellExpansion(module, action);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Field Scope (only for ContentEntry) */}
                    {module === "ContentEntry" && (
                      <div>
                        <Label className="text-[var(--foreground)] mb-2 block">
                          Field Scope
                        </Label>
                        <FieldScopeSelector
                          value={permission.fieldScope || "all"}
                          onChange={(fieldScope) =>
                            updatePermission(module, action, { fieldScope })
                          }
                          onCustomChange={(allowed, denied) =>
                            updatePermission(module, action, {
                              fieldScope: "custom",
                              allowedFields: allowed,
                              deniedFields: denied,
                            })
                          }
                          customFields={{
                            allowed: permission.allowedFields || [],
                            denied: permission.deniedFields || [],
                          }}
                        />
                      </div>
                    )}

                    {/* Content Type Restriction (only for ContentEntry) */}
                    {module === "ContentEntry" && (
                      <div>
                        <Label className="text-[var(--foreground)] mb-2 block">
                          Content Type Restriction (Optional)
                        </Label>
                        <ContentTypeSelector
                          value={permission.contentTypeIds || []}
                          onChange={(contentTypeIds) =>
                            updatePermission(module, action, {
                              contentTypeIds: contentTypeIds.length > 0 ? contentTypeIds : undefined,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePermission(module, action)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Permission
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getFieldScopeLabel(scope?: string): string {
  const labels: Record<string, string> = {
    all: "All",
    seo_only: "SEO Only",
    non_seo_only: "Non-SEO",
    custom: "Custom",
  };
  return labels[scope || "all"] || "All";
}

