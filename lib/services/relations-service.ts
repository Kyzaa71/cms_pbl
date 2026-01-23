import { api } from "@/lib/api-client";
import { ContentRelation } from "@/types/backend-models";
import { searchService } from "@/lib/services/search-service";

export const relationsService = {
  async getRelations(fromEntryId: number, projectId?: number): Promise<ContentRelation[]> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return api.get<ContentRelation[]>(`/content/${fromEntryId}/relations${qs}`);
  },
  async createRelation(fromEntryId: number, payload: { to_content_id: number; relation_type: string; project_id?: number }): Promise<ContentRelation> {
    return api.post<ContentRelation>(`/content/${fromEntryId}/relations`, payload);
  },
  async deleteRelation(relationId: number, projectId?: number): Promise<void> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    await api.delete<void>(`/content/relations/${relationId}${qs}`);
  },
  async getIncomingRelations(entryId: number, projectId?: number): Promise<ContentRelation[]> {
    try {
      let page = 1;
      const limit = 25;
      const collected: ContentRelation[] = [];
      for (let i = 0; i < 3; i++) {
        const { entries, meta } = await searchService.fullText({ q: "", limit, page, project_id: projectId });
        if (!entries.length) break;
        const lists = await Promise.all(
          entries.map(async (e) => {
            try { return await api.get<ContentRelation[]>(`/content/${e.id}/relations${projectId ? `?project_id=${projectId}` : ""}`); }
            catch { return []; }
          })
        );
        collected.push(...lists.flat().filter((r) => r.to_content_id === entryId));
        if (meta?.TotalPages && page >= Number(meta.TotalPages)) break;
        page += 1;
      }
      return collected;
    } catch {
      return [];
    }
  },
};
