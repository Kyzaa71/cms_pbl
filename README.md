# cms_pbl
team6
Frontend CMS — Panduan Setup

Project ini menggunakan Next.js 15, TailwindCSS, shadcn/ui, dan Zustand sebagai state management.

<br>
Branch: upd-fe-lts-stabel-v.2 — Perbedaan & Langkah Setelah Clone

Perbedaan utama di v.2:
- Media Proxy: respons di-stream langsung, header cache publik, dan timeout 10s untuk koneksi macet.
- Preview: capture thumbnail video dengan timeout 5s, plus poster fallback saat thumbnail belum siap.
- Pencarian Media: debounce 300ms agar tidak memicu request beruntun.
- Layout: preconnect ke NEXT_PUBLIC_API_URL untuk mempercepat inisiasi koneksi.
- Organizational Media: progressive loading agar grid media tidak berat di awal.
- Dark Mode: palet warna gelap lebih netral dan konsisten.

File yang paling terdampak:
- app/api/media-proxy/route.ts
- app/preview/page.tsx
- app/layout.tsx
- components/media-assets/media-filters.tsx
- app/organizational/[id]/workspace/media/page.tsx
- styles/globals.css

Langkah setelah clone v.2:
1) Checkout branch
   git checkout upd-fe-lts-stabel-v.2
2) Install dependencies
   npm install
3) Buat file .env.local di akar proyek
   NEXT_PUBLIC_API_URL=http://localhost:8080
   (ganti dengan IP backend jika berada di perangkat lain)
4) Jalankan aplikasi
   npm run dev
5) Opsional: verifikasi lint file yang diubah
   npx eslint app/api/media-proxy/route.ts app/preview/page.tsx

<br>
 1. Install Dependencies

Pastikan sudah berada di folder fe/, lalu jalankan:

npm install


Jika Anda menjalankan project baru atau dependency Zustand belum terpasang, install secara manual:

npm install zustand

<br>
 2. Konfigurasi API URL (Perangkat Berbeda)

Jika ingin mengakses backend dari perangkat lain (HP, laptop lain, dsb.), silakan buat file:

.fe/.env.local


Isi file tersebut dengan:

NEXT_PUBLIC_API_URL=http://IP-DEVICE-BE:8080


Contoh (server lokal):

NEXT_PUBLIC_API_URL=http://localhost:8080


Catatan:

Ganti IP-DEVICE-BE dengan alamat IP backend yang sedang berjalan.

File .env.local otomatis ter-gitignore, jadi aman tidak akan ikut ter-push ke GitHub.

<br>
 3. Menjalankan Project

Setelah semua dependensi ter-install:

npm run dev


Aplikasi default berjalan di:

http://localhost:3000
