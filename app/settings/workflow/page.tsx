"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function WorkflowPage() {
  const router = useRouter();

  // Dummy data
  const workflows = [
    {
      id: 1,
      name: "Workflow 1",
      stages: 1,
      start: "User requests approval",
      editAllowed: "Yes",
      review: "Sent to reviewer group",
      publish: "Auto after approval",
    },
    {
      id: 2,
      name: "Workflow 2",
      stages: 3,
      start: "Content submission",
      editAllowed: "Yes",
      review: "Editorial team approval",
      publish: "Manual publish",
    },
  ];

  // Handler delete (sementara alert)
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      console.log("Deleted workflow:", id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
            Workflow Approval
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] transition-colors">
            Optimize your content review process management
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={() => router.push("/settings/workflow/create")}
        >
          <Plus className="w-4 h-4" />
          Create new flow
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-800 text-white">
              <TableHead className="text-white">Workflow Name</TableHead>
              <TableHead className="text-white">Stages</TableHead>
              <TableHead className="text-white">Start</TableHead>
              <TableHead className="text-white">Edit Allowed</TableHead>
              <TableHead className="text-white">Review Process</TableHead>
              <TableHead className="text-white">Publish</TableHead>
              <TableHead className="text-center text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((wf) => (
              <TableRow key={wf.id}>
                <TableCell>{wf.name}</TableCell>
                <TableCell>{wf.stages}</TableCell>
                <TableCell>{wf.start}</TableCell>
                <TableCell>{wf.editAllowed}</TableCell>
                <TableCell>{wf.review}</TableCell>
                <TableCell>{wf.publish}</TableCell>
                <TableCell className="text-center space-x-2">
                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/settings/workflow/${wf.id}/edit`)
                    }
                  >
                    <Pencil className="w-4 h-4 text-yellow-500" />
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(wf.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
