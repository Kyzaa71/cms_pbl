 import { Suspense } from "react";
 import CreateContentTypeClient from "./CreateContentTypeClient";
 
 export default function CreateContentTypePage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <CreateContentTypeClient />
     </Suspense>
   );
 }
