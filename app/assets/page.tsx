"use client";

import { useState } from "react";
import {
  Folder,
  File,
  Image as ImageIcon,
  Music,
  FileText,
  Plus,
  Filter,
  List,
  MoreVertical,
  FolderOpen,
  X,
  Download,
  Eye,
  Replace,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MediaAssetsPage() {
  const [showSort, setShowSort] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [sortOption, setSortOption] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const folders = [
    { id: 1, name: "Photo profil" },
    { id: 2, name: "pemandangan" },
  ];

  const files = [
    {
      id: 1,
      name: "abcmlabs.jpg",
      type: "image",
      category: "Image",
      src: "/example-image.jpg",
      dimensions: "1000 x 1200",
      uploaded: "Sept 25, 2025",
      author: { name: "Your Name", role: "Editor", avatar: "/avatar.jpg" },
    },
    {
      id: 2,
      name: "cmlabs.pdf",
      type: "document",
      category: "Document",
      uploaded: "Sept 20, 2025",
    },
    {
      id: 3,
      name: "mountain.png",
      type: "image",
      category: "Image",
      src: "/example-image.jpg",
      uploaded: "Sept 22, 2025",
    },
    {
      id: 4,
      name: "song.mp3",
      type: "audio",
      category: "Audio",
      uploaded: "Sept 19, 2025",
    },
  ];

  const sortedAndFilteredFiles = files
    .filter((file) => {
      const matchSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filterType ? file.category === filterType : true;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      if (sortOption === "type") return a.type.localeCompare(b.type);
      return 0;
    });

  const openModal = (file: any) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-10 h-10 text-[var(--primary)]" />;
      case "audio":
        return <Music className="w-10 h-10 text-[var(--warning)]" />;
      case "document":
        return <FileText className="w-10 h-10 text-[var(--danger)]" />;
      default:
        return <File className="w-10 h-10 text-[var(--muted-foreground)]" />;
    }
  };

  const isEmpty = folders.length === 0 && files.length === 0;

  return (
    <div className="p-8 relative bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Title & Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Media Assets</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Optimize your content review process management
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--button-text)] text-sm px-4 py-2 rounded flex items-center gap-2">
            <Folder className="w-4 h-4" /> Create new folder
          </button>
          <Link
            href="/assets/upload"
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] text-sm px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add new assets
          </Link>
        </div>
      </div>

      {/* Search + Sort + Filter */}
      <div className="flex items-center gap-2 mb-6 relative">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input-bg)] text-[var(--foreground)]"
        />

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1 text-sm px-3 py-2 border border-[var(--border)] rounded hover:bg-[var(--bg-secondary)]"
          >
            <List className="w-4 h-4" /> Sort
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showSort ? "rotate-180" : ""}`}
            />
          </button>

          {showSort && (
            <div className="absolute right-0 mt-1 w-44 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border)] rounded-lg shadow-md z-10">
              <button
                onClick={() => {
                  setSortOption("name-asc");
                  setShowSort(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--dropdown-hover-bg)] text-[var(--dropdown-text)]"
              >
                Name (A → Z)
              </button>
              <button
                onClick={() => {
                  setSortOption("name-desc");
                  setShowSort(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--dropdown-hover-bg)] text-[var(--dropdown-text)]"
              >
                Name (Z → A)
              </button>
              <button
                onClick={() => {
                  setSortOption("type");
                  setShowSort(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--dropdown-hover-bg)] text-[var(--dropdown-text)]"
              >
                Type
              </button>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setFilterType(filterType === "Image" ? null : "Image")}
            className={`flex items-center gap-1 text-sm px-3 py-2 border border-[var(--border)] rounded hover:bg-[var(--bg-secondary)] ${
              filterType ? "bg-[var(--primary)] text-[var(--button-text)]" : ""
            }`}
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Folder & File Grid */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center mt-16 text-[var(--muted-foreground)]">
          <FolderOpen className="w-16 h-16 mb-3 text-[var(--muted-foreground)]" />
          <p className="text-base font-medium">Tidak ada assets yang tersedia</p>
          <p className="text-sm text-[var(--text-muted)]">
            Upload atau buat folder baru untuk memulai
          </p>
        </div>
      ) : (
        <>
          {/* Folder Section */}
          {folders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-3 text-[var(--foreground)]">
                Folder <span className="text-sm text-[var(--muted-foreground)]">{folders.length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="bg-[var(--card-bg)] hover:bg-[var(--card-bg-inner)] border border-[var(--border)] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer relative transition"
                  >
                    <Folder className="w-10 h-10 text-[var(--secondary)] mb-2" />
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {folder.name}
                    </span>
                    <button className="absolute top-2 right-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Section */}
          {files.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3 text-[var(--foreground)]">
                Files{" "}
                <span className="text-sm text-[var(--muted-foreground)]">
                  {sortedAndFilteredFiles.length}
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sortedAndFilteredFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => openModal(file)}
                    className="bg-[var(--card-bg)] hover:bg-[var(--card-bg-inner)] border border-[var(--border)] rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition"
                  >
                    {getFileIcon(file.type)}
                    <span className="mt-2 text-sm font-medium text-[var(--foreground)] truncate w-full">
                      {file.name}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] capitalize">
                      {file.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showModal && selectedFile && (
        <div
          className="fixed inset-0 bg-[var(--overlay-bg)] flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--card-bg-inner)] text-[var(--foreground)] border border-[var(--border)] rounded-lg shadow-xl p-6 w-[800px] max-w-full relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Detail Assets</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Left */}
              <div>
                {selectedFile.type === "image" ? (
                  <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-3">
                    <Image
                      src={selectedFile.src || "/placeholder.png"}
                      alt={selectedFile.name}
                      width={500}
                      height={400}
                      className="object-cover w-full"
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg mb-3">
                    {getFileIcon(selectedFile.type)}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] text-sm px-3 py-1.5 rounded flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button className="bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] text-[var(--primary)] text-sm px-3 py-1.5 rounded flex items-center gap-1 border border-[var(--border)]">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--button-text)] text-sm px-3 py-1.5 rounded flex items-center gap-1">
                    <Replace className="w-4 h-4" /> Replace
                  </button>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-3 text-sm">
                  <p>
                    <strong>Nama:</strong> {selectedFile.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedFile.category}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedFile.type}
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {selectedFile.dimensions}
                  </p>
                  <p>
                    <strong>Uploaded:</strong> {selectedFile.uploaded}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div>
                <h3 className="text-base font-semibold mb-3">Metadata</h3>
                <div className="space-y-3">
                  {["Title", "Description", "Alt Text", "Tags"].map((label) => (
                    <div key={label}>
                      <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder="..."
                        className="w-full border border-[var(--border)] rounded px-3 py-1.5 text-sm focus:outline-none bg-[var(--input-bg)] text-[var(--foreground)]"
                        readOnly
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={selectedFile.author?.avatar || "/avatar.jpg"}
                    alt={selectedFile.author?.name || "ava"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border border-[var(--border)]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {selectedFile.author?.name}
                    </p>
                    <span className="text-xs text-[var(--muted-foreground)] bg-[var(--card-bg)] px-2 py-0.5 rounded">
                      {selectedFile.author?.role}
                    </span>
                  </div>
                </div>

                <button className="mt-6 w-full bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--button-text)] py-2 rounded text-sm font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
