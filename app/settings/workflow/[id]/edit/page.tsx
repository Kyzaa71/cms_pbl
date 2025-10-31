"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditWorkflowPage() {
  const router = useRouter();
  const { id } = useParams();

  // State awal form
  const [formData, setFormData] = useState({
    workflowName: "",
    stages: "",
    description: "",
    startProcess: false,
    reviewRequest: false,
    preventPublish: false,
    allowEditDuringReview: false,
    workflowCompletion: false,
  });

  // Ambil data awal (dummy — nanti bisa diganti fetch API)
  useEffect(() => {
    const workflows: Record<number, any> = {
      1: {
        workflowName: "Workflow 1",
        stages: "1",
        description:
          "Alur kerja untuk proses persetujuan konten sebelum dipublikasikan.",
        startProcess: true,
        reviewRequest: true,
        preventPublish: true,
        allowEditDuringReview: false,
        workflowCompletion: true,
      },
      2: {
        workflowName: "Workflow 2",
        stages: "3",
        description:
          "Workflow multi-level dengan tiga tahap persetujuan.",
        startProcess: true,
        reviewRequest: true,
        preventPublish: false,
        allowEditDuringReview: true,
        workflowCompletion: true,
      },
      3: {
        workflowName: "Workflow 3",
        stages: "2",
        description:
          "Workflow dua tahap untuk konten internal.",
        startProcess: true,
        reviewRequest: false,
        preventPublish: false,
        allowEditDuringReview: true,
        workflowCompletion: true,
      },
    };

    const workflow = workflows[Number(id)];
    if (workflow) {
      setFormData(workflow);
    } else {
      setFormData({
        workflowName: "",
        stages: "",
        description: "",
        startProcess: false,
        reviewRequest: false,
        preventPublish: false,
        allowEditDuringReview: false,
        workflowCompletion: false,
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log("Updated workflow:", formData);
    alert("Workflow updated successfully!");
    router.push("/app/settings/workflow");
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Edit Workflow
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors">
            Optimize your content review process management
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/settings/workflow")}
          >
            Back
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Form Section */}
      <Card className="border shadow-sm">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Workflow Name */}
          <div className="col-span-1">
            <Label htmlFor="workflowName">Workflow Name</Label>
            <Input
              id="workflowName"
              name="workflowName"
              className="mt-2"
              value={formData.workflowName}
              onChange={handleChange}
              placeholder="Enter workflow name"
            />
          </div>

          {/* Stages */}
          <div className="col-span-1">
            <Label htmlFor="stages">Stages</Label>
            <Input
              id="stages"
              name="stages"
              className="mt-2"
              value={formData.stages}
              onChange={handleChange}
              placeholder="Enter number of stages"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="mt-2"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this workflow"
            />
          </div>
        </CardContent>
      </Card>

      {/* Access / Process Configuration */}
      <Card className="border shadow-sm">
        <CardContent className="p-6 space-y-6">
          <h2 className="font-semibold text-lg text-purple-800">
            Workflow Process Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="startProcess"
                checked={formData.startProcess}
                onCheckedChange={() => handleCheckboxChange("startProcess")}
              />
              <Label htmlFor="startProcess">
                Memulai alur kerja (Penulis meminta persetujuan)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="reviewRequest"
                checked={formData.reviewRequest}
                onCheckedChange={() => handleCheckboxChange("reviewRequest")}
              />
              <Label htmlFor="reviewRequest">
                Permintaan tinjauan (Penulis mengirimkan ke peninjau)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="preventPublish"
                checked={formData.preventPublish}
                onCheckedChange={() => handleCheckboxChange("preventPublish")}
              />
              <Label htmlFor="preventPublish">
                Pencegahan publikasi saat workflow aktif
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowEditDuringReview"
                checked={formData.allowEditDuringReview}
                onCheckedChange={() => handleCheckboxChange("allowEditDuringReview")}
              />
              <Label htmlFor="allowEditDuringReview">
                Izin pengeditan selama peninjauan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="workflowCompletion"
                checked={formData.workflowCompletion}
                onCheckedChange={() => handleCheckboxChange("workflowCompletion")}
              />
              <Label htmlFor="workflowCompletion">
                Penyelesaian alur kerja (publikasi setelah disetujui)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
