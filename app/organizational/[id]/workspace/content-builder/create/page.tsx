"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CreateContentTypePage from "@/app/content-builder/create/page";

export default function OrgWorkspaceContentBuilderCreatePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) return;
    const current = searchParams.get("project_id");
    if (current === String(id)) return;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("project_id", String(id));
    router.replace(`?${qs.toString()}`);
  }, [id, searchParams, router]);

  return <CreateContentTypePage />;
}
