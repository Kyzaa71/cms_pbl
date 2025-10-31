export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout khusus login (tanpa sidebar/navbar)
  return (
    <>
      {/* Fixed Background */}
      <div 
        className="auth-page-bg fixed inset-0 transition-colors duration-300"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      
      {/* Fixed Blue Column Background */}
      <div 
        className="fixed inset-0 lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      <div 
        className="fixed inset-0 lg:w-2/5 bg-gradient-to-t from-black/20 to-transparent"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      
      {/* Fixed Decorative Elements */}
      <div 
        className="fixed top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      <div 
        className="fixed bottom-20 left-10 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      <div 
        className="fixed top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-md"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>

      {/* Fixed Text Content */}
      <div 
        className="fixed hidden lg:flex lg:w-2/5 h-full items-center justify-center p-8 z-30"
        style={{ backgroundAttachment: 'fixed' }}
      >
        <div className="text-center text-white animate-fade-in-up">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Sign in to your account and continue your journey with us
          </p>
        </div>
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Blue Background (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
          {/* This div is now just for spacing, content is fixed above */}
        </div>

        {/* Right Column - Form */}
        <div className="flex-1 lg:w-3/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
