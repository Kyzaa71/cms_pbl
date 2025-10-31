"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function ProjectDetailPage() {
  const { prsn } = useParams();

  // data sama seperti di halaman sebelumnya
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

  const project = projects.find((p) => p.id === prsn);

  if (!project) {
    return <p className="text-red-500">Project not found</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Enter Project
        </Button>
      </div>

      {/* Info Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-teal-500 text-white font-semibold px-4 py-2">
          Information
        </div>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border">
              <td className="p-2 font-medium border-r w-1/3">Project ID</td>
              <td className="p-2">{project.id}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Project Name</td>
              <td className="p-2">{project.name}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Last Updated</td>
              <td className="p-2">{project.lastUpdate}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Status</td>
              <td className="p-2">
                <Badge className="bg-amber-200 text-amber-800">
                  {project.status}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Custom Domain Section */}
      {/* Custom Domain Section */}
<div className="border rounded-md overflow-hidden">
  <div className="bg-amber-300 font-semibold px-4 py-2">
    Custom Domain
  </div>
  <div className="p-4 text-sm space-y-3">
    <p>
      By default, your site on CMS can be reached through a subdomain
      based on your project name. To make it more personalized, add your
      own custom domain.
    </p>

    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder={project.domain}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <Button className="bg-amber-400 text-black hover:bg-amber-500 text-xs px-4 py-2">
        Save
      </Button>
    </div>
  </div>
</div>


      {/* Danger Zone Section */}
<div className="border rounded-md overflow-hidden">
  <div className="bg-red-600 text-white font-semibold px-4 py-2">
    Danger Zone
  </div>

  <div className="p-4 text-sm space-y-6">
    {/* Duplicate Projects */}
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-red-600 font-semibold text-sm">
          Duplicate Projects
        </h3>
        <p className="text-xs text-red-500 max-w-lg">
          You are about to duplicate this project. A new copy will be created with the same content and settings.
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>

    {/* Duplicate to Personal */}
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-red-600 font-semibold text-sm">
          Duplicate to Personal
        </h3>
        <p className="text-xs text-red-500 max-w-lg">
          You are about to transfer this project to another section. The original project will remain unchanged,
          while a duplicate will be created in the selected section.
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>

    {/* Delete Project */}
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-red-600 font-semibold text-sm">
          Delete Projects
        </h3>
        <p className="text-xs text-red-500 max-w-lg">
          If you delete the organization, it will be permanently deleted and you cannot recover it.
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  </div>
</div>
</div>
  );
}
