 import { Suspense } from "react";
 import CreateRoleClient from "./CreateRoleClient";
 
 export default function CreateRolePage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <CreateRoleClient />
     </Suspense>
   );
 }
