"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Plus, Shuffle } from "lucide-react";

export default function PersonalProjectPage() {
  const router = useRouter();

  const projects = [
    {
      id: "1",
      name: "CMS CmLabs",
      lastUpdate: "32 Minutes Ago",
      status: "Progress",
      domain: "cms-cmlabs.cms.com",
    },
    {
      id: "2",
      name: "CMS Pegadaian",
      lastUpdate: "12 Hours Ago",
      status: "Progress",
      domain: "cms-pegadaian.cms.com",
    },
    {
      id: "3",
      name: "CMS UB",
      lastUpdate: "16 Sep 2025, 15.11",
      status: "Completed",
      domain: "cms-ub.cms.com",
    },
  ];

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Personal Project</h1>

      {/* Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">Project Name</th>
              <th className="py-3 px-4 font-medium">Last Update</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Domain</th>
              <th className="py-3 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className={`border-t border-[var(--border)] ${
                  index % 2 === 0
                    ? "bg-[var(--card-bg-inner)]"
                    : "bg-[var(--card-bg)]"
                } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
              >
                <td className="py-3 px-4">{project.name}</td>
                <td className="py-3 px-4">{project.lastUpdate}</td>
                <td
                  className={`py-3 px-4 font-medium ${
                    project.status === "Completed"
                      ? "text-[var(--primary)]"
                      : project.status === "Progress"
                      ? "text-[var(--success)]"
                      : "text-[var(--muted-foreground)]"
                                    
                  }`}
                >
                  {project.status}
                </td>
                <td className="py-3 px-4 text-[var(--muted-foreground)]">
                  {project.domain}
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    {/* Go to Project */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--secondary)] hover:text-[color-mix(in srgb, var(--secondary) 80%, black)]"
                      onClick={() =>
                        router.push(`/personal-project/${project.id}`)
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    {/* Add something */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--accent)] hover:text-[color-mix(in srgb, var(--accent) 80%, black)]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    {/* Shuffle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--secondary)] hover:text-[color-mix(in srgb, var(--secondary) 80%, black)]"
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
