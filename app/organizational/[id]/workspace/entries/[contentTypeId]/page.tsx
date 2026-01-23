"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ContentTypeEntriesPage from "@/app/content-management/[contentTypeId]/page";

export default function OrgWorkspaceEntriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const contentTypeIdParam = Array.isArray(params.contentTypeId) ? params.contentTypeId[0] : params.contentTypeId;

  useEffect(() => {
    if (!id) return;
    const current = searchParams.get("project_id");
    if (current === String(id)) return;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("project_id", String(id));
    router.replace(`?${qs.toString()}`);
  }, [id, searchParams, router]);

  return <ContentTypeEntriesPage />;
}
