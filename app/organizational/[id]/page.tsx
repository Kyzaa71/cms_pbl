"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UserPlus, Building2, Users, Shield, Calendar, Clock, Hash, UserCircle } from "lucide-react";
import { projectService } from "@/lib/services/project-service";
import { Project, ProjectMember } from "@/types/backend-models";
import { useAuth } from "@/hooks/use-auth";
import { Modal } from "@/components/ui/modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("ProjectViewer");

  useEffect(() => {
    if (idParam) {
      fetchProject(Number(idParam));
    }
  }, [idParam]);

  const fetchProject = async (id: number) => {
    try {
      setLoading(true);
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !project) return;
    
    try {
      await projectService.addProjectMember(project.id, {
        email: inviteEmail,
        role: inviteRole,
      });
      setIsInviteModalOpen(false);
      setInviteEmail("");
      setInviteRole("ProjectViewer");
      fetchProject(project.id);
    } catch (error) {
      console.error("Failed to invite member:", error);
      alert("Failed to invite member. Please check the email address.");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!project) return;
    
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    try {
      await projectService.removeProjectMember(project.id, memberId);
      fetchProject(project.id);
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member.");
    }
  };

  const getUserRole = (proj: Project) => {
    if (!user) return "Unknown";
    const member = proj.members?.find((m) => m.user_id === user.id);
    return member?.role?.name || "Member";
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const handleEnterOrganization = () => {
    if (!project) return;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("active_project_id", String(project.id));
        window.localStorage.setItem("active_project_name", project.name);
      } catch {}
    }
    router.push(`/organizational/${project.id}/workspace`);
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!project) {
    return <p className="p-6 text-red-500">Organization not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">{project.name}</h1>
            <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--muted)]/40 border border-[var(--border)]">
              ID: {project.id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--muted-foreground)]">{project.description || "No description provided"}</p>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white border border-green-700 shadow-sm dark:from-green-500 dark:to-emerald-500 dark:border-green-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/90 ring-2 ring-white/30" />
              Active
            </span>
            <Badge variant="outline" className="capitalize">
              {getUserRole(project)}
            </Badge>
          </div>
        </div>
        <Button
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in srgb, var(--primary) 85%, black)] shadow-sm"
          onClick={handleEnterOrganization}
        >
          Enter Organization
        </Button>
      </div>

      <Card className="border-[var(--border)] bg-[var(--card-bg-inner)]">
        <CardHeader className="px-4 py-3 flex items-center justify-between">
          <CardTitle className="text-base">Information</CardTitle>
          <Building2 className="w-4 h-4 text-[var(--muted-foreground)]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)] text-sm">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Hash className="w-3.5 h-3.5" />
                <span className="font-medium">Organization ID</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--foreground)]">{project.id}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => typeof navigator !== "undefined" && navigator.clipboard?.writeText(String(project.id))}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <UserCircle className="w-3.5 h-3.5" />
                <span className="font-medium">Organization Name</span>
              </div>
              <span className="text-[var(--foreground)]">{project.name}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">Description</span>
              </div>
              <span className="text-[var(--foreground)]">{project.description || "-"}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-medium">Role</span>
              </div>
              <Badge variant="outline" className="capitalize">{getUserRole(project)}</Badge>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">Created At</span>
              </div>
              <span className="text-[var(--foreground)]">{formatDate(project.created_at)}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium">Updated At</span>
              </div>
              <span className="text-[var(--foreground)]">{formatDate(project.updated_at)}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">Collaborators</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {(project.members || []).slice(0, 3).map((m) => (
                    <Avatar key={m.id} className="h-6 w-6 ring-2 ring-[var(--card-bg-inner)] border border-[var(--border)]">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${m.user?.name || "User"}`} />
                      <AvatarFallback>{(m.user?.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                  {(project.members || []).length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] flex items-center justify-center border border-[var(--border)]">
                      +{(project.members || []).length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {(project.members || []).map((m) => m.user?.name).join(", ") || "None"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--border)] bg-[var(--card-bg-inner)]">
        <CardHeader className="px-4 py-3 flex items-center justify-between">
          <CardTitle className="text-base">Members</CardTitle>
          {getUserRole(project) === "ProjectAdmin" && (
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="h-3 w-3 mr-1" />
              Invite Member
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {project.members?.length === 0 ? (
            <div className="p-4 text-center text-[var(--muted-foreground)]">No members found.</div>
          ) : (
            <table className="w-full text-sm border-t border-[var(--border)]">
              <thead>
                <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] border-b border-[var(--border)]">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Joined</th>
                  {getUserRole(project) === "ProjectAdmin" && <th className="py-2 px-4 text-center">Action</th>}
                </tr>
              </thead>
              <tbody>
                {project.members?.map((member) => (
                  <tr key={member.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border border-[var(--border)]">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.user?.name || "User"}`} />
                          <AvatarFallback>{(member.user?.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{member.user?.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-[var(--muted-foreground)]">{member.user?.email}</td>
                    <td className="py-2 px-4">
                      <Badge variant="outline">{member.role?.name}</Badge>
                    </td>
                    <td className="py-2 px-4">
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                    </td>
                    <td className="py-2 px-4 text-[var(--muted-foreground)] text-xs">{formatDate(member.created_at)}</td>
                    {getUserRole(project) === "ProjectAdmin" && (
                      <td className="py-2 px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 80%, black)]"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Member"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter member email address"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ProjectViewer">Viewer</SelectItem>
                <SelectItem value="ProjectEditor">Editor</SelectItem>
                <SelectItem value="ProjectAdmin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>Send Invitation</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
