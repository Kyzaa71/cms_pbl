"use client";

import { useState } from "react";
import { FileText, Edit3, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default function ContentManagement() {
  const getEditLink = (item: any) => {
  if (item.type === "Single Page") return `/content-management/single-page/${item.id}`;
  if (item.type === "Multiple Page") return `/content-management/multiple-page/${item.id}`;
  return "#";
};
  const [contents] = useState([
    {
      id: 1,
      title: "Home Page",
      type: "Single Page",
      updatedAt: "2025-10-15",
    },
    {
      id: 2,
      title: "Blog Articles",
      type: "Multiple Page",
      updatedAt: "2025-10-14",
    },
    {
      id: 3,
      title: "Blog 2",
      type: "Multiple Page",
      updatedAt: "2025-10-10",
    },
    
  ]);

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Content Management
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Kelola semua konten yang telah kamu buat dari Content Builder.
          </p>
        </div>

        {/* 🔗 Tombol Add New Content ke /content-builder */}
        <Link
          href="/content-builder"
          className="flex items-center gap-2 bg-[color:var(--primary)] hover:bg-[color:var(--primary-hover)] text-[var(--button-text)] px-4 py-2 rounded-md transition"
        >
          <Plus className="w-4 h-4" />
          Add New Content
        </Link>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card-bg)] shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Last Updated</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.length > 0 ? (
              contents.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[var(--border)] hover:bg-[var(--hover)] transition"
                >
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.updatedAt}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-3">
                    <Link
                      href={getEditLink(item)}
                      className="text-[color:var(--primary)] hover:opacity-80 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button className="text-[color:var(--danger)] hover:opacity-80 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-[var(--muted-foreground)]"
                >
                  Belum ada konten yang dibuat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
