import { api } from "@/lib/api-client";
import type { User as BackendUser, Role as BackendRole } from "@/types/backend-models";

export const userService = {
  async list(): Promise<BackendUser[]> {
    return api.get<BackendUser[]>("/users");
  },
  async getById(id: number): Promise<BackendUser> {
    return api.get<BackendUser>(`/users/${id}`);
  },
  async create(payload: { name: string; email: string; password: string; role_id?: number }): Promise<BackendUser> {
    return api.post<BackendUser>("/users", payload);
  },
  async update(id: number, payload: { name?: string; email?: string; role_id?: number; password?: string }): Promise<BackendUser> {
    return api.put<BackendUser>(`/users/${id}`, payload);
  },
  async remove(id: number): Promise<void> {
    await api.delete<void>(`/users/${id}`);
  },
};

export const roleService = {
  async list(): Promise<BackendRole[]> {
    return api.get<BackendRole[]>("/roles");
  },
  async listGlobal(): Promise<BackendRole[]> {
    return api.get<BackendRole[]>("/roles?is_global=true");
  },
  async getById(id: number): Promise<BackendRole> {
    return api.get<BackendRole>(`/roles/${id}`);
  },
  async create(payload: { name: string; description?: string; permissions: Array<{ module: string; action: string; field_scope?: string; allowed_fields?: string[]; denied_fields?: string[]; content_type_ids?: number[] }> }): Promise<BackendRole> {
    return api.post<BackendRole>("/roles", payload);
  },
  async update(id: number, payload: { name?: string; description?: string; permissions: Array<{ module: string; action: string; field_scope?: string; allowed_fields?: string[]; denied_fields?: string[]; content_type_ids?: number[] }> }): Promise<BackendRole> {
    return api.put<BackendRole>(`/roles/${id}`, payload);
  },
  async remove(id: number): Promise<void> {
    await api.delete<void>(`/roles/${id}`);
  },
  async duplicate(id: number, name: string): Promise<BackendRole> {
    return api.post<BackendRole>(`/roles/${id}/duplicate`, { name });
  },
  async assignRoleToUser(payload: { user_id: number; role_id: number }): Promise<BackendUser> {
    return api.post<BackendUser>("/roles/assign", payload);
  },
};

