 import { Suspense } from "react";
 import NewPasswordClient from "./NewPasswordClient";
 
 export default function NewPasswordPage() {
   return (
     <Suspense fallback={<div className="p-6"><div className="text-sm text-[var(--muted-foreground)]">Loading...</div></div>}>
       <NewPasswordClient />
     </Suspense>
   );
 }
