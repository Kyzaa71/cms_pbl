"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

type Stage = {
  name: string;
  roles: string;
  color: string;
};

export default function CreateWorkflowPage() {
  const router = useRouter();
  const [workflowName, setWorkflowName] = useState("");
  const [relatedTo, setRelatedTo] = useState("content-management");
  const [keyStage, setKeyStage] = useState("");
  const [stages, setStages] = useState<Stage[]>([
    { name: "", roles: "", color: "" },
  ]);

  const addStage = () => {
    setStages([...stages, { name: "", roles: "", color: "" }]);
  };

  const updateStage = (index: number, field: keyof Stage, value: string) => {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  };

  const handleSave = () => {
    const data = { workflowName, relatedTo, keyStage, stages };
    console.log("Saving workflow:", data);
    alert("Workflow saved successfully!");
  };

  return (
    <div className="ml-8 px-4 py-8 w-[1200px] space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Workflow Approval
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors">
            Optimize your content review process management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--dropdown-hover-bg)] transition-colors"
            onClick={() => router.push("/settings/workflow")}
          >
            <ArrowLeft size={18} /> Back
          </Button>

          <Button
            className="bg-[var(--accent)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] px-6 font-medium transition"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-[var(--card-bg-inner)] border border-[var(--border)] rounded-lg p-5 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="font-medium text-[var(--foreground)]">
              Workflow Name
            </Label>
            <Input
              placeholder="Enter workflow name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <Label className="font-medium text-[var(--foreground)]">
              Related to
            </Label>
            <Select value={relatedTo} onValueChange={setRelatedTo}>
              <SelectTrigger className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]">
                <SelectValue placeholder="Select related module" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--dropdown-bg)] text-[var(--dropdown-text)] border-[var(--dropdown-border)]">
                <SelectItem value="content-management">
                  Content management
                </SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label className="font-medium text-[var(--foreground)]">
              Key Approval Stage
            </Label>
            <Select value={keyStage} onValueChange={setKeyStage}>
              <SelectTrigger className="mt-1 bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]">
                <SelectValue placeholder="Any stages" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--dropdown-bg)] text-[var(--dropdown-text)] border-[var(--dropdown-border)]">
                <SelectItem value="stage-1">Stage 1</SelectItem>
                <SelectItem value="stage-2">Stage 2</SelectItem>
                <SelectItem value="stage-3">Stage 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Publication of entries is restricted until they are at the correct
              stage.
            </p>
          </div>
        </div>

        {/* Stage Table Section */}
        <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] transition-colors">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
            Workflow Stages
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-2 font-semibold text-sm text-[var(--muted-foreground)]">
            <span>Stage Name</span>
            <span>Roles Allowed to Edit This Stage</span>
            <span>Highlight Color</span>
          </div>

          {stages.map((stage, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-3 mb-2 items-center"
            >
              <Input
                placeholder="Stage name"
                value={stage.name}
                onChange={(e) => updateStage(index, "name", e.target.value)}
                className="bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
              />
              <Input
                placeholder="Roles allowed"
                value={stage.roles}
                onChange={(e) => updateStage(index, "roles", e.target.value)}
                className="bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
              />
              <Input
                placeholder="Color (e.g., #ffcc00)"
                value={stage.color}
                onChange={(e) => updateStage(index, "color", e.target.value)}
                className="bg-[var(--input-bg)] border-[var(--border)] text-[var(--foreground)]"
              />
            </div>
          ))}

          <Button
            className="mt-3 bg-[var(--primary)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] transition"
            onClick={addStage}
          >
            + Add new stage
          </Button>
        </div>
      </div>
    </div>
  );
}
