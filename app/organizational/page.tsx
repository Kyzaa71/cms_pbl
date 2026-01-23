"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, ExternalLink } from "lucide-react";
import { projectService } from "@/lib/services/project-service";
import { Project } from "@/types/backend-models";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/hooks/use-auth";

export default function OrganizationalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName) return;
    try {
      await projectService.createProject({
        name: newProjectName,
        description: newProjectDesc,
      });
      setIsCreateModalOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (id: number) => {
      if(!confirm("Are you sure you want to delete this project?")) return;
      try {
          await projectService.deleteProject(id);
          fetchProjects();
      } catch (error) {
          console.error("Failed to delete project:", error);
      }
  }

  // Helper to find current user's role in the project
  const getUserRole = (project: Project) => {
    if (!user) return "Unknown";
    const member = project.members?.find((m) => m.user_id === user.id);
    return member?.role?.name || "Member";
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  }

  return (
    <div className="space-y-6 p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Organizational Project
        </h1>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search..."
            className="w-[350px] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
          />
          <Button
            className="bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[color-mix(in srgb, var(--accent) 80%, black)] px-6 font-medium"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr
              className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left"
            >
              <th className="py-3 px-4 font-medium">Organization Name</th>
              <th className="py-3 px-4 font-medium">Last Update</th>
              <th className="py-3 px-4 font-medium">Collaborators</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody className="bg-[var(--card-bg-inner)]">
            {loading ? (
                <tr>
                    <td colSpan={5} className="py-4 text-center">Loading...</td>
                </tr>
            ) : projects.length === 0 ? (
                <tr>
                    <td colSpan={5} className="py-4 text-center">No organizations found.</td>
                </tr>
            ) : (
                projects.map((org, index) => (
              <tr
                key={org.id}
                className={`border-t border-[var(--border)] ${
                  index % 2 === 0
                    ? "bg-[var(--card-bg-inner)]"
                    : "bg-[var(--card-bg)]"
                } hover:bg-[color-mix(in srgb, var(--card-bg) 80%, white)] transition`}
              >
                <td className="py-3 px-4">{org.name}</td>
                <td className="py-3 px-4 text-[var(--muted-foreground)]">
                  {formatDate(org.updated_at)}
                </td>

                {/* Collaborators */}
                <td className="py-3 px-4">
                  <div className="flex -space-x-3">
                    {org.members?.slice(0, 3).map((m, i) => (
                      <Avatar
                        key={i}
                        className="w-8 h-8 border-1 border-[var(--card-bg-inner)]"
                        title={m.user?.name}
                      >
                        <AvatarFallback className="bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold">
                          {m.user?.name ? m.user.name[0].toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {(org.members?.length || 0) > 3 && (
                      <span className="ml-3 text-xs text-[var(--muted-foreground)]">
                        +{(org.members?.length || 0) - 3}
                      </span>
                    )}
                  </div>
                </td>

                {/* Role */}
                <td className="py-3 px-4">
                  <span
                    className={`font-medium ${
                      getUserRole(org) === "ProjectOwner"
                        ? "text-[var(--success)]"
                        : getUserRole(org) === "ProjectAdmin"
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {getUserRole(org)}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                      onClick={() => handleDeleteProject(org.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--secondary)] hover:text-[color-mix(in srgb, var(--secondary) 80%, black)]"
                      onClick={() => router.push(`/organizational/${org.id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Organization"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter organization name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="Enter description (optional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
