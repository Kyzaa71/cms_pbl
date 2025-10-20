"use client";

import { useState } from "react";
import {
  Home,
  MoreVertical,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FieldPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const openSettings = () => {
    setShowSettings(true);
    setDropdownOpen(false);
  };
  const closeSettings = () => setShowSettings(false);

  const fields = [
    { color: "bg-[var(--primary)]", title: "Text Field", type: "Short Text" },
    { color: "bg-[var(--primary)]", title: "Hero title", type: "Short Text" },
    { color: "bg-[var(--accent)]", title: "Hero Image", type: "Media Field" },
    { color: "bg-[var(--danger)]", title: "Hero Description", type: "Rich Text" },
    { color: "bg-[var(--secondary)]", title: "About Company", type: "Short Text" },
  ];

  return (
    <div className="relative flex bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* === LEFT MAIN CONTENT === */}
      <div className="flex-1 p-6 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 relative">
            <Home className="w-6 h-6 text-[var(--primary)]" />
            <div>
              <span className="text-lg font-semibold text-[var(--foreground)]">
                Home
              </span>
              <p className="text-sm text-[var(--muted-foreground)] -mt-1">
                Build your content
              </p>
            </div>

            <button
              onClick={toggleDropdown}
              className="text-[var(--muted-foreground)] ml-2 hover:text-[var(--foreground)] transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-10 left-12 w-52 bg-[var(--card-bg-inner)] border border-[var(--border)] rounded-lg shadow-md z-10">
                <button
                  onClick={openSettings}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] transition-colors"
                >
                  Settings Configuration
                </button>
                <Link
                  href="/content-management"
                  className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)] transition-colors"
                >
                  To Content Management
                </Link>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] px-4 py-2 rounded transition">
              Create Field Group
            </button>
            <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] px-4 py-2 rounded transition">
              Add Field
            </button>
          </div>
        </div>

        {/* Fields List */}
        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--card-bg-inner)] shadow-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="text-[var(--muted-foreground)] w-5 h-5" />
                <div
                  className={`w-20 h-8 rounded flex items-center justify-center text-white text-sm font-semibold ${field.color}`}
                >
                  Icon
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">
                    {field.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {field.type}
                  </p>
                </div>
              </div>

              <button className="text-[var(--danger)] hover:opacity-80 transition">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* === RIGHT SETTINGS PANEL === */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSettings}
            />

            {/* Sliding Panel */}
            <motion.div
              className="fixed right-0 top-0 h-full w-[380px] bg-[var(--card-bg-inner)] shadow-2xl z-30 p-5 flex flex-col border-l border-[var(--border)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header Panel */}
              <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-2">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Settings Configuration
                </h2>
                <button
                  onClick={closeSettings}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Form */}
              <div className="flex-1 overflow-y-auto">
                <form className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      placeholder="Enter field name"
                    />
                  </div>

                  {/* API ID Field */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      API Id
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-[var(--input-bg-disabled)] text-[var(--muted-foreground)]"
                      value="auto-generated-id"
                      readOnly
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      It’s generated automatically and used to generate API routes.
                    </p>
                  </div>

                  {/* Required Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="required"
                      className="mt-1 w-4 h-4 accent-[var(--primary)]"
                    />
                    <div>
                      <label
                        htmlFor="required"
                        className="font-medium text-sm text-[var(--foreground)]"
                      >
                        Required
                      </label>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Field must be filled before saving. Empty entries will be rejected.
                      </p>
                    </div>
                  </div>

                  {/* Unique Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="unique"
                      className="mt-1 w-4 h-4 accent-[var(--primary)]"
                    />
                    <div>
                      <label
                        htmlFor="unique"
                        className="font-medium text-sm text-[var(--foreground)]"
                      >
                        Unique
                      </label>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Duplicate entries are not allowed. Value must be unique across all records.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] py-2 rounded transition"
                  >
                    Save
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
