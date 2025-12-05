"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname } from "next/navigation";

export default function ContentManagementForm() {
  const { id } = useParams();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    header: "",
    footer: "",
    metaTitle: "",
    metaDescription: "",
  });

  // 🚀 Ambil data berdasarkan type + id (dummy dulu)
  useEffect(() => {
    if (!id) return;

    const dummySinglePage = {
      "1": {
        name: "Home Page",
        description: "Landing page utama perusahaan",
        header: "Navbar",
        footer: "Footer",
        metaTitle: "Home - My Company",
        metaDescription: "Halaman utama website kami.",
      },
      "2": {
        name: "About Page",
        description: "Halaman profil perusahaan",
        header: "Header",
        footer: "Footer",
        metaTitle: "About Us - My Company",
        metaDescription: "Tentang perusahaan dan tim kami.",
      },
    };

    const dummyMultiplePage = {
      "1": {
        name: "Blog",
        description: "Daftar artikel blog terbaru",
        header: "Header",
        footer: "Bottom Links",
        metaTitle: "Blog - My Company",
        metaDescription: "Artikel, berita, dan insight terbaru.",
      },
      "2": {
        name: "Projects",
        description: "Kumpulan proyek dan studi kasus",
        header: "Navbar",
        footer: "Footer",
        metaTitle: "Projects - My Company",
        metaDescription: "Proyek yang pernah kami kerjakan.",
      },
    };

    const isSinglePage = pathname.includes("single-page");
    const data = isSinglePage
      ? dummySinglePage[id as keyof typeof dummySinglePage]
      : dummyMultiplePage[id as keyof typeof dummyMultiplePage];

    if (data) setFormData(data);
  }, [id, pathname]);

  // 💾 Simpan (simulasi)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="p-6 bg-[var(--card-bg)] text-[var(--foreground)] rounded-lg shadow-sm transition-colors duration-300">
      {/* Header Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`text-sm font-medium ${
              activeTab === "content"
                ? "text-[color:var(--primary)] underline"
                : "text-[var(--muted-foreground)] hover:text-[color:var(--primary-hover)]"
            } transition-colors`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`text-sm font-medium ${
              activeTab === "seo"
                ? "text-[color:var(--primary)] underline"
                : "text-[var(--muted-foreground)] hover:text-[color:var(--primary-hover)]"
            } transition-colors`}
          >
            SEO Settings
          </button>
        </div>

        <button
          onClick={handleSave}
          className="bg-[color:var(--primary)] hover:bg-[color:var(--primary-hover)] text-[var(--button-text)] px-4 py-1.5 rounded transition"
        >
          Save
        </button>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-2 rounded bg-[color:var(--success-bg)] text-[color:var(--success-text)] text-sm font-medium"
          >
            ✅ Saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Tabs */}
      {activeTab === "content" ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Header Section
            </label>
            <div className="flex items-center justify-between mt-1 border border-[var(--border)] rounded px-3 py-2 bg-[var(--input-bg)]">
              <select
                className="bg-transparent text-sm text-[var(--foreground)] focus:outline-none"
                value={formData.header}
                onChange={(e) =>
                  setFormData({ ...formData, header: e.target.value })
                }
              >
                <option>Navbar</option>
                <option>Header</option>
              </select>
              <Trash2 className="text-[color:var(--danger)] cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Footer Section
            </label>
            <div className="flex items-center justify-between mt-1 border border-[var(--border)] rounded px-3 py-2 bg-[var(--input-bg)]">
              <select
                className="bg-transparent text-sm text-[var(--foreground)] focus:outline-none"
                value={formData.footer}
                onChange={(e) =>
                  setFormData({ ...formData, footer: e.target.value })
                }
              >
                <option>Footer</option>
                <option>Bottom Links</option>
              </select>
              <Trash2 className="text-[color:var(--danger)] cursor-pointer" />
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Meta Description
            </label>
            <input
              type="text"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: e.target.value,
                })
              }
              className="mt-1 w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </div>
        </form>
      )}
    </div>
  );
}
