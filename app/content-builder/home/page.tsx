"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import Link from "next/link";

export default function FieldPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const fields = [
    {
      title: "Text Field",
      desc: "Used for short or long texts, such as titles, names, or rich texts.",
    },
    {
      title: "Media Field",
      desc: "Used for uploading and managing files like images, videos, audio, and documents.",
    },
    {
      title: "Number Field",
      desc: "Used for numeric values with options for integers and decimals.",
    },
    {
      title: "Date and Time",
      desc: "Used for temporal data with calendar input/time and configurable formatting.",
    },
    {
      title: "Location",
      desc: "Used for geographic data via address input map or coordinates.",
    },
    {
      title: "Multiple Content",
      desc: "Used for managing multiple content, allowing flexible combination component.",
    },
    {
      title: "Relation",
      desc: "Used for linking entries across content types with configurable cardinality.",
    },
  ];

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
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
        </div>

        <div className="flex gap-2">
          <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] px-4 py-2 rounded transition-colors">
            Create Field Group
          </button>
          <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] px-4 py-2 rounded transition-colors">
            Add Field
          </button>
        </div>
      </div>

      {/* Content Builder Grid */}
      <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-sm transition-colors duration-300">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Content Builder
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field, idx) => (
            <div
              key={idx}
              className="bg-[var(--card-bg-inner)] rounded-lg shadow p-4 flex gap-3 items-start transition-colors duration-300"
            >
              <div className="bg-[var(--accent)] w-12 h-12 rounded-lg flex items-center justify-center text-[var(--accent-text)] font-semibold">
                Img
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">
                  {field.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {field.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
