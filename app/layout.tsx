import "@/styles/globals.css";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "CMS Dashboard",
  description: "Static CMS dashboard using Next.js and shadcn/ui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"suppressHydrationWarning>
      <body className="flex bg-gray-100 min-h-screen">
       
        <Sidebar />
        <main className="flex-1">
          <Navbar />
          <div className="p-6">{children}</div>
        </main>
        
      </body>
    </html>
  );
}
