 import { Suspense } from "react";
 import WorkflowManagementClient from "./WorkflowManagementClient";
 
 export default function WorkflowManagementPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <WorkflowManagementClient />
     </Suspense>
   );
 }
