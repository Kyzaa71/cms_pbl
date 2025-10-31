import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "CMS Dashboard",
  description: "Static CMS dashboard using Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 min-h-screen">
        <ThemeProvider defaultTheme="light" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
