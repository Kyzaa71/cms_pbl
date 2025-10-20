"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateApiTokenPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--card-bg-mid)]">
            API and Integration
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Optimize your API and Integration management
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/settings/api")}
            className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--dropdown-hover-bg)]"
          >
            Back
          </Button>
          <Button className="bg-[var(--accent)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] font-medium">
            Save
          </Button>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border border-[var(--border)] bg-[var(--card-bg-inner)] shadow-sm">
        <CardContent className="space-y-6 p-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[var(--foreground)]">API Token Name</Label>
              <Input
                placeholder="..."
                className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--foreground)]"
              />
            </div>
            <div>
              <Label className="text-[var(--foreground)]">Description</Label>
              <Input
                placeholder="..."
                className="bg-[var(--input-bg)] border border-[var(--border)] text-[var(--foreground)]"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[var(--foreground)]">Validity Period</Label>
              <Select>
                <SelectTrigger className="border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]">
                  <SelectValue placeholder="Input" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dropdown-bg)] text-[var(--dropdown-text)] border-[var(--dropdown-border)]">
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                If the validity period has passed, the API will be immediately
                deleted from the list.
              </p>
            </div>

            <div>
              <Label className="text-[var(--foreground)]">Access Scope</Label>
              <Select>
                <SelectTrigger className="border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dropdown-bg)] text-[var(--dropdown-text)] border-[var(--dropdown-border)]">
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Permission Section */}
      <div className="border border-[var(--border)] rounded-lg bg-[var(--card-bg-inner)] p-6 shadow-sm">
        <h2 className="font-semibold text-[var(--foreground)] mb-3">
          Access Permission
        </h2>

        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] font-semibold px-4 py-2">
            Customizable Content Models and Schema
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <RadioGroup defaultValue="create">
              {[
                { id: "create", label: "Create Content Models" },
                { id: "update", label: "Update Content Models" },
                { id: "delete", label: "Delete Content Models" },
                { id: "find", label: "Find Content Models" },
                { id: "findone", label: "Find One Content Model" },
                { id: "all", label: "All" },
              ].map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center space-x-2 text-[var(--foreground)]"
                >
                  <RadioGroupItem value={opt.id} id={opt.id} />
                  <Label htmlFor={opt.id}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
