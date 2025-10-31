"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

export default function CreateComponent() {
  const [activeTab, setActiveTab] = useState<"basic" | "advance">("basic");
  const [multiLang, setMultiLang] = useState(false);
  const [seo, setSeo] = useState(false);
  const [workflow, setWorkflow] = useState(false);

  return (
    <div className="max-w-4xl w-full bg-[var(--card-bg-inner)] border border-[var(--border)] rounded-lg p-6 shadow-md transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Create Component
        </h2>
        <Link
          href="/content-builder"
          className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[var(--border)] mb-6">
        <button
          onClick={() => setActiveTab("basic")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === "basic"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Basic Configuration
        </button>
        <button
          onClick={() => setActiveTab("advance")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === "advance"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Advance Configuration
        </button>
      </div>

      {/* Basic Configuration */}
      {activeTab === "basic" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">
              Component
            </label>
            <input
              type="text"
              placeholder="Enter Component..."
              className="w-full mt-1 border border-[var(--border)] bg-[var(--input-bg)] rounded px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">
              API
            </label>
            <input
              type="text"
              placeholder="Auto-generated"
              className="w-full mt-1 border border-[var(--border)] bg-[var(--input-bg)] rounded px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              It’s generated automatically and used to create API routes.
            </p>
          </div>

          <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] py-2 rounded-md mt-4 transition">
            Create Component
          </button>
        </div>
      )}

      {/* Advance Configuration */}
      {activeTab === "advance" && (
        <div className="space-y-5">
          {[
            {
              label: "Multi Language",
              desc: "Enable this feature to support multiple languages.",
              state: multiLang,
              setState: setMultiLang,
            },
            {
              label: "SEO",
              desc: "Enable SEO optimization for this component.",
              state: seo,
              setState: setSeo,
            },
            {
              label: "Workflow",
              desc: "Enable structured workflow automation for component logic.",
              state: workflow,
              setState: setWorkflow,
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-[var(--foreground)]">
                  {item.label}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {item.desc}
                </p>
              </div>
              <Switch checked={item.state} onCheckedChange={item.setState} />
            </div>
          ))}

          <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] py-2 rounded-md mt-6 transition">
            Save Configuration
          </button>
        </div>
      )}
    </div>
  );
}
