 import { Suspense } from "react";
 import ContentManagementClient from "./ContentManagementClient";
 
 export default function ContentManagementPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <ContentManagementClient />
     </Suspense>
   );
 }
