"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectService } from "@/lib/services/project-service";
// import { roleService } from "@/lib/services/user-service";
import { graphql } from "@/lib/api-client";
import { workflowService } from "@/lib/services/workflow-service";
import type { ProjectMember, Role } from "@/types/backend-models";
import { useAuth } from "@/hooks/use-auth";

const PROJECT_ROLES = ["ProjectViewer", "ProjectEditor", "ProjectContentWriter", "ProjectAdmin", "ProjectOwner"];

export default function CollaboratorsPage() {
  const params = useParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const projectId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inviteUserId, setInviteUserId] = useState<number | undefined>(undefined);
  const [inviteRole, setInviteRole] = useState<string>(PROJECT_ROLES[0]);
  // const [assignContentWriter, setAssignContentWriter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; role?: { name?: string } }>>([]);
  const [userQuery, setUserQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    fetchMembers();
  }, [projectId]);

  async function fetchMembers() {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await graphql<{ projectMembers: Array<{ id: number; userId: number; roleId?: number; role?: string; roleDetail?: Role; user?: { id: number; name: string; email: string } }> }>(
        `query GetMembers($projectId: ID!) {
          projectMembers(projectId: $projectId) {
            id
            userId
            roleId
            role
            roleDetail { id name }
            user { id name email }
          }
        }`,
        { projectId: String(projectId) }
      );
      const list = (data?.projectMembers || []).map((m) => ({
        id: m.id,
        project_id: Number(projectId),
        user_id: Number(m.userId),
        role_id: m.roleId ? Number(m.roleId) : 0,
        user: m.user ? { ...m.user, role: undefined, profile: "", provider: "", status: "" } as any : undefined,
        role: m.roleDetail ? { ...m.roleDetail, description: "", permissions: [], created_at: "", updated_at: "" } as any : undefined,
        status: "active",
        invited_by: 0,
        created_at: "",
        updated_at: "",
      })) as ProjectMember[];
      setMembers(list);
      setError(null);
    } catch (e) {
      setMembers([]);
      setError(e instanceof Error ? e.message : "Gagal memuat member");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(
    () =>
      members.filter((m) =>
        (m.user?.name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [members, search]
  );

  useEffect(() => {
    if (!isAddOpen) return;
    (async () => {
      try {
        // Prefer GraphQL to avoid FE auto-redirect on 401 from REST
        const data = await graphql<{ users: Array<{ id: number; name: string; email: string; role?: { name?: string } }> }>(
          `query { users { id name email role { name } } }`
        );
        const list = data?.users || [];
        setUsers(list.map((u) => ({ id: Number(u.id as unknown as string), name: u.name, email: u.email, role: u.role ? { name: u.role.name } : undefined })));
      } catch {
        // Fallback: workflow assignees (content_writer users)
        try {
          const list = await workflowService.getAssignees(projectId ?? undefined);
          setUsers((list || []).map((u) => ({ id: Number(u.id as unknown as string), name: u.name, email: u.email, role: u.role ? { name: (u.role as Role)?.name } : undefined })));
        } catch {
          setUsers([]);
        }
      }
    })();
  }, [isAddOpen]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    const memberIds = new Set((members || []).map((m) => Number(m.user_id)));
    const base = users.filter((u) => {
      const uid = Number(u.id);
      if (user?.id && uid === Number(user.id)) return false;
      if (memberIds.has(uid)) return false;
      return true;
    });
    if (!q) return base;
    return base.filter((u) => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
  }, [users, userQuery, user?.id, members]);

  async function handleAddCollaborator() {
    if (!projectId) return;
    setSubmitting(true);
    try {
      let created: ProjectMember | null = null;
      if (inviteUserId && inviteUserId > 0) {
        const data = await graphql<{ addProjectMember: { id: number; userId: number; roleId?: number; role?: string; roleDetail?: Role; user?: { id: number; name: string; email: string } } }>(
          `mutation Add($projectId: ID!, $userId: ID!, $role: String!) {
            addProjectMember(projectId: $projectId, userId: $userId, role: $role) {
              id
              userId
              roleId
              role
              roleDetail { id name }
              user { id name email }
            }
          }`,
          {
            projectId: String(projectId),
            userId: String(inviteUserId),
            role: inviteRole,
          }
        );
        const m = data.addProjectMember;
        created = {
          id: m.id,
          project_id: Number(projectId),
          user_id: Number(m.userId),
          role_id: m.roleId ? Number(m.roleId) : 0,
          user: m.user ? { ...m.user, role: undefined, profile: "", provider: "", status: "" } as any : undefined,
          role: m.roleDetail ? { ...m.roleDetail, description: "", permissions: [], created_at: "", updated_at: "" } as any : undefined,
          status: "active",
          invited_by: 0,
          created_at: "",
          updated_at: "",
        };
      }

      // Removed global content_writer assignment; using project-scoped role instead

      if (created) {
        setMembers((prev) => [
          ...prev,
          {
            ...created,
            user_id: Number(created.user_id),
            role_id: Number(created.role_id),
          },
        ]);
      }

      setIsAddOpen(false);
      setInviteUserId(undefined);
      setInviteRole(PROJECT_ROLES[0]);
      // setAssignContentWriter(false);
      await fetchMembers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menambah collaborator");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(memberId: number) {
    if (!projectId) return;
    try {
      await projectService.removeProjectMember(projectId, memberId);
      await fetchMembers();
    } catch {}
  }

  return (
    <div className="space-y-6 text-[var(--foreground)] bg-[var(--background)] transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Collaborator</h1>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)]"
          />
          <span className="absolute left-2 top-2.5 text-[var(--muted-foreground)]"></span>
        </div>
        <Button
          className="bg-[var(--accent)] hover:bg-[color-mix(in srgb, var(--accent) 85%, black)] text-[var(--accent-text)] font-medium"
          onClick={() => setIsAddOpen(true)}
        >
          Add Collaborator
        </Button>
      </div>

      <Card className="overflow-hidden border border-[var(--border)] rounded-md shadow-sm bg-[var(--card-bg-inner)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] text-left">
              <th className="py-3 px-4 font-medium">Collaborator Name</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr className="border-t border-[var(--border)]">
                <td className="py-6 px-4 text-center text-[var(--muted-foreground)]" colSpan={4}>
                  No collaborators
                </td>
              </tr>
            )}
            {filtered.map((m, i) => (
              <tr
                key={m.id}
                className={`border-t border-[var(--border)] ${
                  i % 2 === 0 ? "bg-[var(--card-bg-inner)]" : "bg-[var(--card-bg)]"
                } hover:bg-[color-mix(in srgb, var(--primary) 8%, var(--card-bg-inner))] transition`}
              >
                <td className="py-3 px-4">
                  <div className="font-medium">{m.user?.name || m.user_id}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">ID: {m.user_id}</div>
                </td>
                <td className="py-3 px-4">
                  <Badge className="bg-[color-mix(in srgb, var(--primary) 20%, white)] text-[var(--primary)] border-none">
                    Active
                  </Badge>
                </td>
                <td className="py-3 px-4">{m.role?.name || m.role_id}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[var(--border)] text-[var(--danger)] hover:text-[color-mix(in srgb, var(--danger) 75%, black)]"
                      onClick={() => handleRemove(m.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Collaborator">
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cari User</label>
            <Input
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Cari berdasarkan nama atau email"
            />
            <div className="max-h-64 overflow-auto border border-[var(--border)] rounded-md">
              {filteredUsers.length === 0 && (
                <div className="p-3 text-sm text-[var(--muted-foreground)]">Tidak ada user</div>
              )}
              {filteredUsers.map((u) => {
                const selected = inviteUserId === u.id;
                return (
                  <div
                    key={u.id}
                    className={`w-full px-3 py-2 flex items-center justify-between hover:bg-[var(--card-bg)] transition cursor-pointer ${
                      selected ? "bg-[color-mix(in srgb, var(--primary) 10%, var(--card-bg-inner))] ring-1 ring-[var(--primary)]" : ""
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setInviteUserId(u.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="userSelect"
                        checked={selected}
                        onChange={() => setInviteUserId(u.id)}
                        className="accent-[var(--primary)]"
                      />
                      <div>
                        <div className="font-medium">{u.name || `User #${u.id}`}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">{u.email}</div>
                      </div>
                    </div>
                    {u.role?.name && (
                      <Badge className="border-none bg-[color-mix(in srgb, var(--primary) 20%, white)] text-[var(--primary)]">
                        {u.role.name}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Project Role</label>
            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Global content_writer checkbox removed - organization-specific role is available in Project Role */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCollaborator} disabled={submitting || !inviteUserId}>
              {submitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
