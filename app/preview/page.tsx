 import { Suspense } from "react";
 import PreviewClient from "./PreviewClient";
 
 export default function PreviewPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <PreviewClient />
     </Suspense>
   );
 }
