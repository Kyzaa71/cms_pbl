 import { Suspense } from "react";
 import ContentBuilderClient from "./ContentBuilderClient";
 
 export default function ContentBuilderPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <ContentBuilderClient />
     </Suspense>
   );
 }
