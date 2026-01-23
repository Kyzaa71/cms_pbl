"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ContentManagementPage from "@/app/content-management/page";

export default function OrgWorkspaceEntriesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;
    const current = searchParams.get("project_id");
    if (current === String(id)) {
      setReady(true);
      return;
    }
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("project_id", String(id));
    router.replace(`?${qs.toString()}`);
  }, [id, searchParams, router]);

  if (!ready) return null;
  return <ContentManagementPage />;
}
