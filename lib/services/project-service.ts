import { request, graphql } from "../api-client";
import { Project, ProjectMember, User, Role } from "@/types/backend-models";

export const projectService = {
  getAllProjects: async () => {
    try {
      const data = await graphql<{
        projects: Array<{
          id: number;
          name: string;
          description?: string;
          createdBy: number;
          creator?: { id: number; name: string };
          members?: Array<{
            id: number;
            projectId: number;
            userId: number;
            user?: { id: number; name: string };
            roleId: number;
            roleDetail?: { id: number; name: string };
            status: string;
            invitedBy: number;
            createdAt: string;
            updatedAt: string;
          }>;
          contentTypes?: Array<{ id: number; name: string }>;
          createdAt: string;
          updatedAt: string;
        }>;
      }>(
        `
        query {
          projects {
            id
            name
            description
            createdBy
            creator { id name }
            members {
              id
              projectId
              userId
              user { id name }
              roleId
              roleDetail { id name }
              status
              invitedBy
              createdAt
              updatedAt
            }
            contentTypes { id name }
            createdAt
            updatedAt
          }
        }
        `
      );
      return (data.projects || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        created_by: p.createdBy,
        creator: p.creator ? ({ id: p.creator.id, name: p.creator.name } as unknown as User) : undefined,
        members: (p.members || []).map((m) => ({
          id: m.id,
          project_id: m.projectId,
          user_id: m.userId,
          user: m.user ? ({ id: m.user.id, name: m.user.name } as unknown as User) : undefined,
          role_id: m.roleId,
          role: m.roleDetail as unknown as Role,
          status: m.status,
          invited_by: m.invitedBy,
          created_at: m.createdAt,
          updated_at: m.updatedAt,
        })),
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      })) as Project[];
    } catch {
      return request<Project[]>("/projects");
    }
  },

  createProject: async (data: { name: string; description?: string }) => {
    const result = await graphql<{
      createProject: {
        id: number;
        name: string;
        description?: string;
        createdBy: number;
        creator?: { id: number; name: string };
        members?: Array<{
          id: number;
          projectId: number;
          userId: number;
          user?: { id: number; name: string };
          roleId: number;
          roleDetail?: { id: number; name: string };
          status: string;
          invitedBy: number;
          createdAt: string;
          updatedAt: string;
        }>;
        createdAt: string;
        updatedAt: string;
      };
    }>(`
      mutation CreateProject($name: String!, $description: String) {
        createProject(name: $name, description: $description) {
          id
          name
          description
          createdBy
          creator { id name }
          members {
            id
            projectId
            userId
            user { id name }
            roleId
            roleDetail { id name }
            status
            invitedBy
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    `, { name: data.name, description: data.description });

    const p = result.createProject;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      created_by: p.createdBy,
      creator: p.creator ? ({ id: p.creator.id, name: p.creator.name } as unknown as User) : undefined,
      members: (p.members || []).map((m) => ({
        id: m.id,
        project_id: m.projectId,
        user_id: m.userId,
        user: m.user ? ({ id: m.user.id, name: m.user.name } as unknown as User) : undefined,
        role_id: m.roleId,
        role: m.roleDetail as unknown as Role,
        status: m.status,
        invited_by: m.invitedBy,
        created_at: m.createdAt,
        updated_at: m.updatedAt,
      })),
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    } as Project;
  },

  getProjectById: async (id: number) => {
    return request<Project>(`/projects/${id}`);
  },

  updateProject: async (id: number, data: { name: string; description?: string }) => {
    return request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (id: number) => {
    return request<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  getProjectMembers: async (projectId: number) => {
    return request<ProjectMember[]>(`/projects/${projectId}/members`);
  },

  addProjectMember: async (projectId: number, data: { user_id?: number; email?: string; role: string }) => {
    return request<ProjectMember>(`/projects/${projectId}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  removeProjectMember: async (projectId: number, memberId: number) => {
    return request<void>(`/projects/${projectId}/members/${memberId}`, {
      method: "DELETE",
    });
  },

  updateProjectMemberRole: async (projectId: number, memberId: number, role: string) => {
    return request<ProjectMember>(`/projects/${projectId}/members/${memberId}`, {
        method: "PUT",
        body: JSON.stringify({ role }),
    });
  }
};
