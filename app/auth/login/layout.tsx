export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout khusus login (tanpa sidebar/navbar)
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left image section */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80')",
        }}
      ></div>

      {/* Right form section */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6">{children}</div>
      </div>
    </div>
  );
}
