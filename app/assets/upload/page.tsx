 import { Suspense } from "react";
 import UploadMediaClient from "./UploadMediaClient";
 
 export default function UploadMediaPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <UploadMediaClient />
     </Suspense>
   );
 }
