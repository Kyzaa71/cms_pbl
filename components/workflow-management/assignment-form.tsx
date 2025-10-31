"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dummyUsers } from "./types";
import { Calendar } from "lucide-react";

interface AssignmentFormProps {
  entryTitle: string;
  onSubmit: (assignedTo: number, dueDate?: string) => void;
  onCancel: () => void;
}

export function AssignmentForm({
  entryTitle,
  onSubmit,
  onCancel,
}: AssignmentFormProps) {
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedTo) return;

    onSubmit(parseInt(assignedTo), dueDate || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Assign Entry</Label>
        <p className="text-sm text-[var(--muted-foreground)] mb-2">
          {entryTitle}
        </p>
      </div>

      <div>
        <Label htmlFor="assignedTo">
          Assign To <span className="text-[var(--danger)]">*</span>
        </Label>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {dummyUsers.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Due Date (Optional)
        </Label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-2 w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input-bg)] text-[var(--foreground)]"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[100px] !bg-white dark:!bg-[var(--card-bg-inner)] !text-[var(--foreground)] !border-[var(--border)] hover:!bg-[var(--card-bg)] hover:!border-[var(--primary)]/30 hover:!text-[var(--primary)] !cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!assignedTo}
          className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--primary)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
        >
          Assign
        </Button>
      </div>
    </form>
  );
}

