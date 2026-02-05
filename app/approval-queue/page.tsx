 import { Suspense } from "react";
 import ApprovalQueueClient from "./ApprovalQueueClient";
 
 export default function ApprovalQueuePage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="flex items-center justify-center h-64"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div></div>}>
       <ApprovalQueueClient />
     </Suspense>
   );
 }
