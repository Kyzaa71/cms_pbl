 "use client";
 
 import React, { useEffect, useState } from "react";
 import { useSearchParams, useRouter } from "next/navigation";
 import Link from "next/link";
 import {
   ArrowLeft,
   Calendar,
   Tag,
   Hash,
   FileText,
   Search,
   Link as LinkIcon,
   Clock,
   CheckCircle2,
   AlertCircle,
   Loader2,
   ExternalLink,
   Image as ImageIcon,
   ChevronDown,
   ChevronUp,
 } from "lucide-react";
 import { contentService } from "@/lib/services/content-service";
 import type { ContentEntry, MediaFile } from "@/types/backend-models";
 import { mediaService } from "@/lib/services/media-service";
 import { getBaseUrl } from "@/lib/api-client";
 import { format } from "date-fns";
 import NextImage from "next/image";
 
 export default function PreviewClient() {
   const router = useRouter();
   const search = useSearchParams();
   const entryIdParam = search.get("entry_id");
   const token = search.get("token") || "";
   const [entry, setEntry] = useState<ContentEntry | null>(null);
   const [error, setError] = useState<string | null>(null);
   const entryId = entryIdParam ? parseInt(entryIdParam, 10) : NaN;
   const [heroSrc, setHeroSrc] = useState<string | null>(null);
   const [previewMap, setPreviewMap] = useState<Record<string, string>>({});
   const [videoPreviewMap, setVideoPreviewMap] = useState<Record<string, string>>({});
   const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
   const BASE_URL = getBaseUrl();
 
   function normalizeUrl(url?: string): string | null {
     if (!url) return null;
     const cleaned = url.trim().replace(/[\\]+/g, "/");
     if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
     if (cleaned.startsWith("/")) return `${BASE_URL}${cleaned}`;
     return `${BASE_URL}/${cleaned}`;
   }
   function proxiedUrl(url?: string): string | null {
     const u = normalizeUrl(url);
     return u ? `/api/media-proxy?url=${encodeURIComponent(u)}` : null;
   }
   async function captureVideoThumbnail(url: string): Promise<string | null> {
     return new Promise((resolve) => {
       const video = document.createElement("video");
       video.src = url;
       video.preload = "metadata";
       video.muted = true;
       const timeout = setTimeout(() => {
         video.removeEventListener("loadeddata", onLoaded);
         video.removeEventListener("error", onError);
         resolve(null);
       }, 5000);
       const onLoaded = () => {
         try {
           const w = Math.max(1, video.videoWidth || 1280);
           const h = Math.max(1, video.videoHeight || 720);
           const maxW = 1280;
           const scale = Math.min(1, maxW / w);
           const canvas = document.createElement("canvas");
           canvas.width = Math.max(1, Math.round(w * scale));
           canvas.height = Math.max(1, Math.round(h * scale));
           const ctx = canvas.getContext("2d");
           if (!ctx) {
             resolve(null);
             return;
           }
           ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
           const dataUrl = canvas.toDataURL("image/jpeg");
           resolve(dataUrl);
         } catch {
           resolve(null);
         } finally {
           video.removeEventListener("loadeddata", onLoaded);
           video.removeEventListener("error", onError);
           clearTimeout(timeout);
         }
       };
       const onError = () => {
         clearTimeout(timeout);
         resolve(null);
       };
       video.addEventListener("loadeddata", onLoaded, { once: true });
       video.addEventListener("error", onError, { once: true });
     });
   }
 
   const isMediaField = (key: string): boolean => {
     const lower = key.toLowerCase();
     return (
       lower.includes("image") ||
       lower.includes("media") ||
       lower.includes("foto") ||
       lower.includes("photo") ||
       lower.includes("gambar") ||
       lower.includes("video") ||
       lower.endsWith("_media_id")
     );
   };
 
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
     return () => {
       active = false;
     };
   }, [entryId, token]);
 
   useEffect(() => {
     async function resolveHero() {
       if (!entry) {
         setHeroSrc(null);
         return;
       }
       const obj = (entry.data || {}) as Record<string, unknown>;
       const keys = Object.keys(obj);
       const candidates = ["banner","image","featured_image","thumbnail","cover","foto","photo","gambar","picture"];
       let key = keys.find((k) => candidates.some((c) => k.toLowerCase().includes(c)));
       let value = key ? obj[key] : undefined;
       if (!key) {
         key = keys.find((k) => k.toLowerCase().endsWith("_media_id"));
         value = key ? obj[key] : undefined;
       }
       if (!key) {
         key = keys.find((k) => {
           const v = obj[k];
           return typeof v === "string" && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(String(v));
         });
         value = key ? obj[key] : undefined;
       }
       if (!key || value === undefined) {
         setHeroSrc(null);
         return;
       }
       if (typeof value === "number") {
         try {
           const mf: MediaFile = await mediaService.getById(value as number);
           const url = mf?.url ? normalizeUrl(mf.url) : null;
           if (url && /(\.mp4|\.webm|\.ogg|\.mov|\.avi|\.mkv)$/i.test(url)) {
             const p = proxiedUrl(url);
             const thumb = p ? await captureVideoThumbnail(p) : null;
             setHeroSrc(thumb);
           } else {
             setHeroSrc(url ? proxiedUrl(url) : null);
           }
         } catch {
           setHeroSrc(null);
         }
         return;
       }
       if (typeof value === "string") {
         const trimmed = (value as string).trim();
         const isImg = /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(trimmed);
         const isVid = /(\.mp4|\.webm|\.ogg|\.mov|\.avi|\.mkv)$/i.test(trimmed);
         if (isImg) {
           const url = normalizeUrl(trimmed);
           setHeroSrc(url ? proxiedUrl(url) : null);
         } else if (isVid) {
           const p = proxiedUrl(trimmed);
           const thumb = p ? await captureVideoThumbnail(p) : null;
           setHeroSrc(thumb);
         } else {
           setHeroSrc(null);
         }
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
       const nextVideo: Record<string, string> = { ...videoPreviewMap };
       await Promise.all(
         Object.entries(obj)
           .filter(
             ([k, v]) =>
               typeof v === "number" &&
               (k.toLowerCase().includes("image") ||
                 k.toLowerCase().includes("media") ||
                 k.toLowerCase().includes("foto") ||
                 k.toLowerCase().includes("photo") ||
                 k.toLowerCase().includes("gambar") ||
                 k.toLowerCase().includes("video") ||
                 k.toLowerCase().endsWith("_media_id")),
           )
           .map(async ([k, v]) => {
             try {
               const mf = await mediaService.getById(Number(v));
               const url = mf?.url ? normalizeUrl(mf.url) : null;
               if (url) {
                 const proxyUrl = `/api/media-proxy?url=${encodeURIComponent(url)}`;
                 if (/(\.mp4|\.webm|\.ogg|\.mov|\.avi|\.mkv)$/i.test(url)) {
                   nextVideo[k] = proxyUrl;
                 } else {
                   next[k] = proxyUrl;
                 }
               }
             } catch {}
           }),
       );
       Object.entries(obj)
         .filter(([k, v]) => typeof v === "string" && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(String(v)))
         .forEach(([k, v]) => {
           const url = normalizeUrl(String(v));
           if (url) next[k] = `/api/media-proxy?url=${encodeURIComponent(url)}`;
         });
       Object.entries(obj)
         .filter(([k, v]) => typeof v === "string" && /(\.mp4|\.webm|\.ogg|\.mov|\.avi|\.mkv)$/i.test(String(v)))
         .forEach(([k, v]) => {
           const url = normalizeUrl(String(v));
           if (url) nextVideo[k] = `/api/media-proxy?url=${encodeURIComponent(url)}`;
         });
       setPreviewMap(next);
       setVideoPreviewMap(nextVideo);
     }
     resolveGridImages();
   }, [entry]);
 
   const handleBack = () => {
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
   };
 
   const toggleExpand = (key: string) => {
     setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }));
   };
 
   const renderTextContent = (text: string, key: string) => {
     const MAX_LENGTH = 200;
     const isLong = text.length > MAX_LENGTH;
     const isExpanded = expandedFields[key];
     if (!isLong) {
       return <p className="text-sm text-slate-700 dark:text-slate-300 break-words whitespace-pre-wrap">{text}</p>;
     }
     return (
       <div>
         <p className="text-sm text-slate-700 dark:text-slate-300 break-words whitespace-pre-wrap">
           {isExpanded ? text : `${text.substring(0, MAX_LENGTH)}...`}
         </p>
         <button
           onClick={() => toggleExpand(key)}
           className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
         >
           {isExpanded ? (
             <>
               Tampilkan lebih sedikit
               <ChevronUp className="w-3.5 h-3.5" />
             </>
           ) : (
             <>
               Tampilkan lebih banyak
               <ChevronDown className="w-3.5 h-3.5" />
             </>
           )}
         </button>
       </div>
     );
   };
 
   if (error) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
         <div className="max-w-md w-full">
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30 overflow-hidden">
             <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4">
               <div className="flex items-center gap-3 text-white">
                 <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                   <AlertCircle className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-semibold">Preview Error</h2>
               </div>
             </div>
             <div className="p-6">
               <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
               <Link href="/">
                 <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                   <ArrowLeft className="w-4 h-4" />
                   Back to Home
                 </button>
               </Link>
             </div>
           </div>
         </div>
       </div>
     );
   }
 
   if (!entry) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center">
         <div className="relative">
           <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
           <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin relative" />
         </div>
         <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium">Loading preview...</p>
       </div>
     );
   }
 
   const data = (entry.data || {}) as Record<string, unknown>;
   const title = String(data.title || data.judul || data.name || data.meta_title || `${entry.content_type?.name || "Entry"} #${entry.id}`);
   const description = String(data.description || data.excerpt || data.summary || "");
   const slug = typeof data.slug === "string" ? data.slug : undefined;
   const metaDesc = typeof data.meta_description === "string" ? data.meta_description : undefined;
   const canonical = typeof data.canonical_url === "string" ? data.canonical_url : undefined;
 
   const contentFields = Object.entries(data).filter(([key]) => {
     const lower = key.toLowerCase();
     return !["title","judul","name","meta_title","description","excerpt","summary","slug","canonical_url","meta_description","banner","image","featured_image","thumbnail","cover"].some((k) => lower.includes(k)) && !isMediaField(key);
   });
   const mediaFields = Object.entries(data).filter(([key]) => isMediaField(key));
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
       <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50">
         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
           <div className="flex items-center justify-between h-16">
             <div className="flex items-center gap-3">
               <button onClick={handleBack} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400" aria-label="Go back">
                 <ArrowLeft className="w-5 h-5" />
               </button>
               <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700" />
               <h2 className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-xs lg:max-w-md">{title}</h2>
             </div>
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Preview</span>
               </div>
             </div>
           </div>
         </div>
       </header>
 
       <div className="relative">
         {heroSrc ? (
           <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
             <NextImage src={heroSrc} alt="Preview Image" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent" />
             <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
               <div className="max-w-7xl mx-auto">
                 <div className="flex flex-wrap gap-2 mb-3">
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20">
                     <Tag className="w-3 h-3" />
                     {entry.content_type?.name || "Content"}
                   </span>
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                     <CheckCircle2 className="w-3 h-3" />
                     {entry.status}
                   </span>
                 </div>
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight max-w-4xl">{title}</h1>
                 {description && <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl line-clamp-2">{description}</p>}
               </div>
             </div>
           </div>
         ) : (
           <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 sm:py-16 lg:py-20">
             <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
               <div className="flex flex-wrap gap-2 mb-3">
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20">
                   <Tag className="w-3 h-3" />
                   {entry.content_type?.name || "Content"}
                 </span>
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                   <CheckCircle2 className="w-3 h-3" />
                   {entry.status}
                 </span>
               </div>
               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight max-w-4xl">{title}</h1>
               {description && <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl">{description}</p>}
             </div>
           </div>
         )}
       </div>
 
       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
           <div className="lg:col-span-2 space-y-4 lg:space-y-6">
             {description && (
               <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                 <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                   <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                     <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Ringkasan</h3>
                 </div>
                 <div className="p-4">{renderTextContent(description, "description")}</div>
               </section>
             )}
 
             <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
               <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                 <div className="p-1.5 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                   <Hash className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                 </div>
                 <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Detail Konten</h3>
               </div>
               <div className="p-4">
                 {contentFields.length === 0 ? (
                   <p className="text-slate-500 dark:text-slate-400 text-center py-6 text-sm">Tidak ada data konten tambahan</p>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {contentFields.map(([key, value]) => {
                       const text = typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : Array.isArray(value) ? JSON.stringify(value) : value ? JSON.stringify(value) : "";
                       const isUrl = typeof value === "string" && /^https?:\/\//i.test(value.trim());
                       return (
                         <div key={key} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                           <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{key.replace(/_/g, " ")}</p>
                           {isUrl ? (
                             <a href={text} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all flex items-start gap-1.5">
                               {text}
                               <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                             </a>
                           ) : (
                             renderTextContent(text, key)
                           )}
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>
             </section>
 
             {mediaFields.length > 0 && (
               <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                 <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                   <div className="p-1.5 bg-pink-50 dark:bg-pink-500/10 rounded-lg">
                     <ImageIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                   </div>
                   <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Media</h3>
                 </div>
                 <div className="p-4">
                   <div className="grid grid-cols-1 gap-4">
                     {mediaFields.map(([key, value]) => {
                       const hasImage = previewMap[key];
                       const hasVideo = videoPreviewMap[key];
                       const isVideoUrl = typeof value === "string" && /(\.mp4|\.webm|\.ogg|\.mov|\.avi|\.mkv)$/i.test((value as string).trim());
                       if (typeof value === "string" && (hasImage || hasVideo)) {
                         const isDuplicate = mediaFields.some(([otherKey, otherValue]) => {
                           return otherKey !== key && typeof otherValue === "number" && (previewMap[otherKey] === hasImage || videoPreviewMap[otherKey] === hasVideo);
                         });
                         if (isDuplicate) return null;
                       }
                       return (
                         <div key={key} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                           <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{key.replace(/_/g, " ")}</p>
                           {hasImage ? (
                             <div className="rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                               <img src={previewMap[key]} alt={key} className="w-full h-auto object-contain max-h-[500px]" />
                             </div>
                           ) : hasVideo || isVideoUrl ? (
                             <div className="rounded-lg overflow-hidden bg-slate-900 relative">
                               <video controls className="w-full h-auto max-h-[500px]" preload="metadata" poster={hasVideo ? `${videoPreviewMap[key]}#t=0.1` : heroSrc || `data:image/svg+xml;base64,${btoa(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"450\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#0f172a\"/><stop offset=\"1\" stop-color=\"#1e293b\"/></linearGradient></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#g)\"/></svg>`)}`
                               }>
                                 <source src={hasVideo ? videoPreviewMap[key] : String(value)} type="video/mp4" />
                                 <source src={hasVideo ? videoPreviewMap[key] : String(value)} type="video/webm" />
                                 <source src={hasVideo ? videoPreviewMap[key] : String(value)} type="video/ogg" />
                                 Browser Anda tidak mendukung tag video.
                               </video>
                             </div>
                           ) : (
                             <p className="text-sm text-slate-700 dark:text-slate-300 font-mono break-all">
                               {typeof value === "number" ? `Media ID: ${value}` : String(value)}
                             </p>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 </div>
               </section>
             )}
           </div>
 
           <div className="space-y-4 lg:space-y-5">
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
               <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                 <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                   <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                 </div>
                 <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Metadata</h3>
               </div>
               <div className="p-4 space-y-3">
                 <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                   <span className="text-xs text-slate-500 dark:text-slate-400">ID</span>
                   <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">#{entry.id}</span>
                 </div>
                 <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                   <span className="text-xs text-slate-500 dark:text-slate-400">Tipe</span>
                   <span className="text-xs font-medium text-slate-900 dark:text-white">{entry.content_type?.name || "-"}</span>
                 </div>
                 <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                   <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                   <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">{entry.status}</span>
                 </div>
                 <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                   <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                     <Clock className="w-3 h-3" />
                     Diperbarui
                   </span>
                   <span className="text-xs text-slate-900 dark:text-white">{format(new Date(entry.updated_at), "dd MMM yyyy")}</span>
                 </div>
                 {entry.published_at && (
                   <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                     <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                       <Calendar className="w-3 h-3" />
                       Dipublikasikan
                     </span>
                     <span className="text-xs text-slate-900 dark:text-white">{format(new Date(entry.published_at), "dd MMM yyyy")}</span>
                   </div>
                 )}
                 {slug && (
                   <div className="flex items-center justify-between py-1.5">
                     <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                       <LinkIcon className="w-3 h-3" />
                       Slug
                     </span>
                     <span className="text-xs text-slate-900 dark:text-white font-mono truncate max-w-[140px]">/{slug}</span>
                   </div>
                 )}
               </div>
             </div>
 
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
               <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                 <div className="p-1.5 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg">
                   <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                 </div>
                 <h3 className="font-semibold text-slate-900 dark:text-white text-sm">SEO</h3>
               </div>
               <div className="p-4 space-y-4">
                 <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Preview</p>
                   <div className="space-y-1">
                     <p className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate hover:underline cursor-pointer">{String(data.meta_title || title)}</p>
                     {canonical && (
                       <p className="text-xs text-green-600 dark:text-green-500 truncate flex items-center gap-1">
                         {canonical}
                         <ExternalLink className="w-3 h-3 flex-shrink-0" />
                       </p>
                     )}
                     <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{metaDesc || "Belum ada meta description"}</p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div>
                     <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Meta Description</p>
                     <p className="text-xs text-slate-700 dark:text-slate-300 break-words">
                       {metaDesc || <span className="text-slate-400 italic">Belum diatur</span>}
                     </p>
                   </div>
                   {canonical && (
                     <div>
                       <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Canonical URL</p>
                       <p className="text-xs text-slate-700 dark:text-slate-300 break-all">{canonical}</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
