import { api } from "@/lib/api-client";
import { ContentRelation } from "@/types/backend-models";
import { searchService } from "@/lib/services/search-service";

export const relationsService = {
  async getRelations(fromEntryId: number): Promise<ContentRelation[]> {
    return api.get<ContentRelation[]>(`/content/${fromEntryId}/relations`);
  },
  async createRelation(fromEntryId: number, payload: { to_content_id: number; relation_type: string }): Promise<ContentRelation> {
    return api.post<ContentRelation>(`/content/${fromEntryId}/relations`, payload);
  },
  async deleteRelation(relationId: number): Promise<void> {
    await api.delete<void>(`/content/relations/${relationId}`);
  },
  async getIncomingRelations(entryId: number): Promise<ContentRelation[]> {
    try {
      let page = 1;
      const limit = 25;
      const collected: ContentRelation[] = [];
      for (let i = 0; i < 3; i++) {
        const { entries, meta } = await searchService.fullText({ q: "", limit, page });
        if (!entries.length) break;
        const lists = await Promise.all(
          entries.map(async (e) => {
            try { return await api.get<ContentRelation[]>(`/content/${e.id}/relations`); }
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
