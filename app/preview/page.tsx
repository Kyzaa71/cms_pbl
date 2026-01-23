"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { contentService } from "@/lib/services/content-service";
import type { ContentEntry } from "@/types/backend-models";
import type { MediaFile } from "@/types/backend-models";
import { mediaService } from "@/lib/services/media-service";
import { getBaseUrl } from "@/lib/api-client";
import { format } from "date-fns";

export default function PreviewPage() {
  const router = useRouter();
  const search = useSearchParams();
  const entryIdParam = search.get("entry_id");
  const token = search.get("token") || "";

  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const entryId = entryIdParam ? parseInt(entryIdParam, 10) : NaN;
  const [heroSrc, setHeroSrc] = useState<string | null>(null);
  const [previewMap, setPreviewMap] = useState<Record<string, string>>({});
  const BASE_URL = getBaseUrl();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!entryId || isNaN(entryId)) {
          setError("Missing or invalid entry_id");
          return;
        }
        if (!token) {
          setError("Missing preview token");
          return;
        }
        const data = await contentService.previewEntry(entryId, token);
        if (active) setEntry(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }
    load();
    return () => { active = false; };
  }, [entryId, token]);

  useEffect(() => {
    async function resolveHero() {
      if (!entry) { setHeroSrc(null); return; }
      const obj = (entry.data || {}) as Record<string, unknown>;
      const keys = Object.keys(obj);
      const candidates = ["banner", "image", "featured_image", "thumbnail", "cover", "foto", "photo", "gambar", "picture"];
      let key = keys.find(k => candidates.some(c => k.toLowerCase().includes(c)));
      let value = key ? obj[key] : undefined;
      if (!key) {
        key = keys.find(k => k.toLowerCase().endsWith("_media_id"));
        value = key ? obj[key] : undefined;
      }
      if (!key) {
        key = keys.find(k => {
          const v = obj[k];
          return typeof v === "string" && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(String(v));
        });
        value = key ? obj[key] : undefined;
      }
      if (!key || value === undefined) { setHeroSrc(null); return; }
      if (typeof value === "number") {
        try {
          const mf: MediaFile = await mediaService.getById(value);
          const url = mf?.url ? normalizeUrl(mf.url) : null;
          setHeroSrc(url ? `/api/media-proxy?url=${encodeURIComponent(url)}` : null);
        } catch {
          setHeroSrc(null);
        }
        return;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        const isImg = /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(trimmed);
        const url = isImg ? normalizeUrl(trimmed) : null;
        setHeroSrc(url ? `/api/media-proxy?url=${encodeURIComponent(url)}` : null);
        return;
      }
      setHeroSrc(null);
    }
    resolveHero();
  }, [entry, BASE_URL]);

  useEffect(() => {
    async function resolveGridImages() {
      if (!entry) return;
      const obj = (entry.data || {}) as Record<string, unknown>;
      const next: Record<string, string> = { ...previewMap };
      // from media_id pattern
      await Promise.all(
        Object.entries(obj)
          .filter(([k, v]) => typeof v === "number" && (k.toLowerCase().includes("image") || k.toLowerCase().includes("media") || k.toLowerCase().includes("foto") || k.toLowerCase().includes("photo") || k.toLowerCase().includes("gambar") || k.toLowerCase().endsWith("_media_id")))
          .map(async ([k, v]) => {
            try {
              const mf = await mediaService.getById(Number(v));
              const url = mf?.url ? normalizeUrl(mf.url) : null;
              if (url) next[k] = `/api/media-proxy?url=${encodeURIComponent(url)}`;
            } catch {}
          })
      );
      // from string paths
      Object.entries(obj)
        .filter(([k, v]) => typeof v === "string" && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(String(v)))
        .forEach(([k, v]) => {
          const url = normalizeUrl(String(v));
          if (url) next[k] = `/api/media-proxy?url=${encodeURIComponent(url)}`;
        });
      setPreviewMap(next);
    }
    resolveGridImages();
  }, [entry]);

  function normalizeUrl(url?: string): string | null {
    if (!url) return null;
    const cleaned = url.trim().replace(/[\\]+/g, "/");
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    if (cleaned.startsWith("/")) return `${BASE_URL}${cleaned}`;
    return `${BASE_URL}/${cleaned}`;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="p-6 border border-[var(--danger)] bg-[color-mix(in srgb, var(--danger) 10%, var(--card-bg))]">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Preview Error</h2>
          <p className="text-sm text-[var(--foreground)]">{error}</p>
          <div className="mt-4">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Loading preview...</p>
        </Card>
      </div>
    );
  }

  const data = (entry.data || {}) as Record<string, unknown>;
  const title =
    String(
      data.title ||
        data.judul ||
        data.name ||
        data.meta_title ||
        `${entry.content_type?.name || "Entry"} #${entry.id}`
    );
  const description =
    String(
      data.description ||
        data.excerpt ||
        data.summary ||
        ""
    );
  const slug = typeof data.slug === "string" ? data.slug : undefined;
  const metaDesc = typeof data.meta_description === "string" ? data.meta_description : undefined;
  const canonical = typeof data.canonical_url === "string" ? data.canonical_url : undefined;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="p-6 bg-[var(--card-bg)] border border-[var(--border)]">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">{title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[var(--card-bg-inner)] text-[var(--foreground)] border border-[var(--border)]">
                {entry.content_type?.name || "Content"}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">{entry.status}</Badge>
              <Badge className="bg-[var(--card-bg-inner)] text-[var(--muted-foreground)] border border-[var(--border)]">
                {format(new Date(entry.updated_at), "dd MMM yyyy, HH:mm")}
              </Badge>
              {slug && (
                <Badge className="bg-[var(--card-bg-inner)] text-[var(--muted-foreground)] border border-[var(--border)]">
                  /{slug}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => {
              try {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                  return;
                }
              } catch {}
              try {
                const pid = typeof window !== "undefined" ? window.localStorage.getItem("active_project_id") : null;
                if (pid) {
                  router.push(`/organizational/${pid}/workspace`);
                  return;
                }
              } catch {}
              router.push("/");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {heroSrc && (
        <Card className="overflow-hidden border border-[var(--border)]">
          <img src={heroSrc} alt="Preview Image" className="w-full h-[360px] object-cover" />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {description && (
            <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Ringkasan</h3>
              <p className="text-base leading-relaxed text-[var(--foreground)]">{description}</p>
            </Card>
          )}
          <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Detail Konten</h3>
            {Object.keys(data).length === 0 ? (
              <p className="text-[var(--muted-foreground)]">Tidak ada data konten</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                  const lower = key.toLowerCase();
                  if (["title", "judul", "name", "meta_title", "description", "excerpt", "summary", "slug", "canonical_url", "meta_description", "banner", "image", "featured_image", "thumbnail", "cover"].some(k => lower.includes(k))) {
                    return null;
                  }
                  const text =
                    typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                      ? String(value)
                      : Array.isArray(value)
                        ? JSON.stringify(value)
                        : value
                          ? JSON.stringify(value)
                          : "";
                  return (
                    <div key={key} className="p-4 rounded border border-[var(--border)] bg-[var(--card-bg)]">
                      <p className="text-xs font-medium text-[var(--muted-foreground)]">{key}</p>
                      {previewMap[key] ? (
                        <div className="mt-2 w-full h-32 rounded overflow-hidden bg-[var(--card-bg-inner)] border border-[var(--border)]">
                          <img src={previewMap[key]} alt={key} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <p className="text-sm text-[var(--foreground)] mt-1 break-all max-h-24 overflow-auto">{text}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Metadata</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">ID</p>
                <p className="text-sm text-[var(--foreground)]">#{entry.id}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">Tipe Konten</p>
                <p className="text-sm text-[var(--foreground)]">{entry.content_type?.name || "-"}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">Status</p>
                <Badge className="bg-blue-100 text-blue-800">{entry.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">Diperbarui</p>
                <p className="text-sm text-[var(--foreground)]">{format(new Date(entry.updated_at), "dd MMM yyyy, HH:mm")}</p>
              </div>
              {entry.published_at && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--muted-foreground)]">Dipublikasikan</p>
                  <p className="text-sm text-[var(--foreground)]">{format(new Date(entry.published_at), "dd MMM yyyy, HH:mm")}</p>
                </div>
              )}
              {slug && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--muted-foreground)]">Slug</p>
                  <p className="text-sm text-[var(--foreground)]">/{slug}</p>
                </div>
              )}
            </div>
          </Card>
          <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">SEO</h3>
            <div className="space-y-3">
              {metaDesc ? (
                <div>
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">Meta Description</p>
                  <p className="text-sm text-[var(--foreground)]">{metaDesc}</p>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">Belum ada meta description</p>
              )}
              {canonical && (
                <div>
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">Canonical URL</p>
                  <p className="text-sm text-[var(--foreground)]">{canonical}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
