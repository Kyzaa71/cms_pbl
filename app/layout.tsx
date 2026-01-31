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
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={api} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider defaultTheme="light" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
