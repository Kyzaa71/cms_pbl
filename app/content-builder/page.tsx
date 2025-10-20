"use client";

export default function ContentBuilderPage() {
  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 min-h-screen">
      <div className="max-w-2xl">
        {/* === CARD CONTENT BUILDER === */}
        <div className="bg-gradient-to-br from-[var(--card-bg-gradient-1)] to-[var(--card-bg-gradient-2)] text-[var(--card-text)] rounded-lg p-6 mb-6 shadow-md transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-2">Content Builder</h2>
          <p className="text-sm mb-4 opacity-90">Build Your First Layout</p>
          <p className="text-sm opacity-90">
            The Content Builder allows you to visually create and structure your page using flexible and customizable 
            components. It supports various content types to suit your project need.
          </p>
        </div>

        {/* === DESCRIPTIONS === */}
        <div className="space-y-4 mb-6">
  <div>
    <h3 className="font-semibold text-[var(--card-bg-mid)] mb-1">
      Single Page
    </h3>
    <p className="text-sm text-[var(--foreground)]/80">
      Use this when the layout connects to only one content entry. Suitable for pages like “Home” or “Profile”.
    </p>
  </div>

  <div>
    <h3 className="font-semibold text-[var(--card-bg-mid)] mb-1">
      Multiple Page
    </h3>
    <p className="text-sm text-[var(--foreground)]/80">
      Designed for dynamic collections such as blog posts or product listings. One layout, multiple entries.
    </p>
  </div>

  <div>
    <h3 className="font-semibold text-[var(--card-bg-mid)] mb-1">
      Component
    </h3>
    <p className="text-sm text-[var(--foreground)]/80">
      Reusable UI blocks (text sections, images, etc.) that you can freely arrange and customize.
    </p>
  </div>
</div>


        {/* === BUTTON === */}
        <button className="w-full bg-[var(--card-bg-gradient-2)] hover:bg-[var(--card-bg-mid-alt)] text-[var(--card-text)] py-3 rounded-lg font-medium transition-colors">
          Build Your Content
        </button>
      </div>
    </div>
  );
}
