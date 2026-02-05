"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ApprovalQueueClient from "@/app/approval-queue/ApprovalQueueClient";

function OrgWorkspaceApprovalInner() {
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

  const ready = !!id && searchParams.get("project_id") === String(id);
  if (!ready) return null;
  return <ApprovalQueueClient />;
}

export default function OrgWorkspaceApprovalPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
      <OrgWorkspaceApprovalInner />
    </Suspense>
  );
}
