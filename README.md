# cms_pbl
team6
Frontend CMS — Panduan Setup

Project ini menggunakan Next.js 15, TailwindCSS, shadcn/ui, dan Zustand sebagai state management.

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
