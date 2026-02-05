 import { Suspense } from "react";
 import ContentRelationsClient from "./ContentRelationsClient";
 
 export default function ContentRelationsPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <ContentRelationsClient />
     </Suspense>
   );
 }
