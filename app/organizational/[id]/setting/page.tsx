"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

// Contoh data (nantinya bisa diganti fetch dari API)
const projectData = [
  { id: "ORG001", name: "CMS CMLABS" },
  { id: "ORG002", name: "Finance" },
  { id: "ORG003", name: "Event Manager" },
];

export default function SettingsPage() {
  const params = useParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

  const project = projectData.find(
    (item) => item.id.toLowerCase() === String(idParam).toLowerCase()
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Setting</h1>

      {/* Information */}
      <div>
        <div className="rounded-t-md bg-emerald-500 text-white font-medium px-4 py-2">
          Information
        </div>
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-0">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 w-1/3 font-medium text-muted-foreground">
                    Organization ID
                  </td>
                  <td className="px-4 py-2">{project ? project.id : "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-muted-foreground">
                    Organization Name
                  </td>
                  <td className="px-4 py-2">
                    {project ? project.name : "Unknown Organization"}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <div>
        <div className="rounded-t-md bg-red-600 text-white font-medium px-4 py-2">
          Danger Zone
        </div>
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h2 className="text-red-600 font-semibold text-sm">
                Delete Organization
              </h2>
              <p className="text-xs text-red-500 mt-1">
                If you delete the organization, it will be permanently deleted
                and cannot be recovered.
              </p>
            </div>
            <Trash2 className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
