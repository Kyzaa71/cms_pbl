export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left form section */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6">{children}</div>
      </div>

      {/* Right background (image placeholder) */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80')",
        }}
      ></div>
    </div>
  );
}
