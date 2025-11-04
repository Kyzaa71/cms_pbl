"use client";

export default function ContentBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 min-h-screen">
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
