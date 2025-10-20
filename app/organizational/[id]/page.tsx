"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function OrganizationDetailPage() {
  const { org } = useParams();

  // Data sama seperti sebelumnya
  const organizations = [
    {
      id: "ORG001",
      name: "CMS CmLabs",
      lastUpdate: "32 Minutes Ago",
      collaborators: ["Me", "JK", "AB"],
      role: "Owner",
      domain: "cms-cmlabs.cms.com",
      status: "Active",
    },
    {
      id: "ORG002",
      name: "CMS Pegadaian",
      lastUpdate: "12 Hours Ago",
      collaborators: ["AD", "RL", "ST", "GG"],
      role: "Admin",
      domain: "cms-pegadaian.cms.com",
      status: "Active",
    },
    {
      id: "ORG003",
      name: "CMS UB",
      lastUpdate: "16 Sep 2025, 15:11",
      collaborators: ["JO", "KK"],
      role: "Member",
      domain: "cms-ub.cms.com",
      status: "Completed",
    },
  ];

const params = useParams();
const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

const selectedOrg = organizations.find(
  (o) => o.id.toLowerCase() === idParam?.toLowerCase()
);



  if (!selectedOrg) {
    return <p className="text-red-500">Organization not found</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{selectedOrg.name}</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Enter Organization
        </Button>
      </div>

      {/* Info Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-purple-700 text-white font-semibold px-4 py-2">
          Information
        </div>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border">
              <td className="p-2 font-medium border-r w-1/3">Organization ID</td>
              <td className="p-2">{selectedOrg.id}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Organization Name</td>
              <td className="p-2">{selectedOrg.name}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Role</td>
              <td className="p-2">{selectedOrg.role}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Last Updated</td>
              <td className="p-2">{selectedOrg.lastUpdate}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Status</td>
              <td className="p-2">
                <Badge className="bg-amber-200 text-amber-800">
                  {selectedOrg.status}
                </Badge>
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium border-r">Collaborators</td>
              <td className="p-2">{selectedOrg.collaborators.join(", ")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Custom Domain Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-amber-300 font-semibold px-4 py-2">
          Custom Domain
        </div>
        <div className="p-4 text-sm space-y-3">
          <p>
            By default, your organization site can be reached through a
            subdomain based on your organization name. To make it more
            personalized, add your own custom domain.
          </p>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={selectedOrg.domain}
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
          {/* Duplicate Organization */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-red-600 font-semibold text-sm">
                Duplicate Organization
              </h3>
              <p className="text-xs text-red-500 max-w-lg">
                You are about to duplicate this organization. A new copy will be
                created with the same content and settings.
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

          {/* Transfer to Personal */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-red-600 font-semibold text-sm">
                Transfer to Personal
              </h3>
              <p className="text-xs text-red-500 max-w-lg">
                You are about to transfer this organization to another section.
                The original organization will remain unchanged, while a
                duplicate will be created in the selected section.
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

          {/* Delete Organization */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-red-600 font-semibold text-sm">
                Delete Organization
              </h3>
              <p className="text-xs text-red-500 max-w-lg">
                If you delete the organization, it will be permanently deleted
                and cannot be recovered.
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
