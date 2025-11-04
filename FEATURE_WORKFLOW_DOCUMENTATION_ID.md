# Dokumentasi Alur Kerja Fitur CMS

## Daftar Isi

1. [Content Builder](#content-builder)
2. [Content Management](#content-management)
3. [Content Relations](#content-relations)
4. [Assets Media](#assets-media)
5. [Workflow Management](#workflow-management)
6. [Approval Queue](#approval-queue)
7. [User Management](#user-management)
8. [Role & Permissions](#role--permissions)

---

## Content Builder

### Gambaran Umum
Content Builder adalah fondasi dari CMS, memungkinkan administrator untuk mendefinisikan tipe konten (schema) dan field-fieldnya. Berfungsi sebagai blueprint untuk membuat entri konten di modul Content Management.

### Alur Kerja: Membuat Content Type

#### Proses Langkah demi Langkah

1. **Navigasi ke Content Builder**
   - Pengguna klik "Content Builder" di sidebar
   - Halaman menampilkan: `/content-builder`

2. **Inisiasi Pembuatan**
   - Pengguna klik tombol "Create New Content Type"
   - Navigasi ke: `/content-builder/create`

3. **Mengisi Form Content Type**
   - **Field Nama**: Masukkan nama tampilan (contoh: "Article", "Product")
   - **Field API Slug**: Otomatis dibuat dari nama, bisa diedit
     - Format: lowercase, menggunakan tanda hubung untuk spasi (contoh: "blog-article")
   - **Toggle SEO Enabled**: Aktifkan/nonaktifkan field SEO
   - **Submit**: Klik "Create Content Type"

4. **Proses Backend**
   - **Panggilan API**: `POST /content/types`
   - **Validasi**: Memeriksa keunikan nama, format slug
   - **Database**: Membuat record `ContentType`
   - **Response**: Mengembalikan ContentType yang dibuat beserta ID

5. **Pengalihan**
   - Pengguna diarahkan ke: `/content-builder/{id}`
   - Menampilkan halaman detail Content Type dengan tab Overview

### Alur Kerja: Menambah Field ke Content Type

#### Proses Langkah demi Langkah

1. **Akses Detail Content Type**
   - Navigasi ke halaman detail Content Type: `/content-builder/{id}`
   - Klik tab "Fields" atau quick action "Add Field"

2. **Navigasi ke Pembuatan Field**
   - Klik tombol "Add New Field" di tab Fields
   - ATAU klik card "Add Field" di Quick Actions
   - Navigasi ke: `/content-builder/{id}/fields/create`

3. **Mengisi Form Field**
   - **Nama Field**: Masukkan identifier field (contoh: "title", "description")
   - **Tipe Field**: Pilih dari dropdown:
     - `text` - Teks satu baris
     - `textarea` - Teks multi-baris
     - `number` - Nilai numerik
     - `boolean` - True/false
     - `date` - Pemilih tanggal
     - `datetime` - Tanggal dan waktu
     - `select` - Pemilihan dropdown
     - `multiselect` - Pemilihan ganda
     - `media` - Pemilih file media
     - `relation` - Link ke konten lain
     - `json` - Data JSON
   - **Required**: Toggle untuk membuat field wajib
   - **Unique**: Toggle untuk menegakkan keunikan
   - **SEO Field**: Toggle untuk menandai sebagai field SEO
   - **Placeholder**: Teks placeholder opsional
   - **Help Text**: Deskripsi opsional
   - **Aturan Validasi**:
     - Min Length, Max Length (untuk field teks)
     - Min Value, Max Value (untuk field angka)
     - Pattern (pola regex untuk validasi)
     - Default Value

4. **Perilaku Spesifik Tipe Field**
   - **Media Field**: Membuka media library picker saat diklik
   - **Relation Field**: Membuka content selector untuk menghubungkan entri
   - **Select/Multiselect**: Menampilkan input opsi

5. **Proses Backend**
   - **Panggilan API**: `POST /content/types/{content_type_id}/fields`
   - **Validasi**: Memvalidasi keunikan nama field dalam content type
   - **Database**: Membuat record `ContentField`
   - **Response**: Mengembalikan ContentField yang dibuat

6. **Pengalihan**
   - Pengguna diarahkan kembali ke: `/content-builder/{id}?tab=fields`
   - Field muncul dalam daftar Fields

### Alur Kerja: Mengedit Content Type

#### Proses Langkah demi Langkah

1. **Akses Halaman Edit**
   - Dari halaman detail Content Type
   - Klik tombol "Edit" (orange)
   - Navigasi ke: `/content-builder/{id}/edit`

2. **Modifikasi Content Type**
   - Edit Nama, Slug, atau toggle SEO
   - Klik "Save Changes"

3. **Proses Backend**
   - **Panggilan API**: `PUT /content/types/{id}`
   - **Validasi**: Memeriksa keunikan nama, format slug
   - **Database**: Memperbarui record `ContentType`
   - **Response**: Mengembalikan ContentType yang diperbarui

4. **Pengalihan**
   - Pengguna diarahkan ke: `/content-builder/{id}`
   - Menampilkan informasi yang diperbarui

### Alur Kerja: Mengedit Field

#### Proses Langkah demi Langkah

1. **Akses Edit Field**
   - Dari tab Fields di detail Content Type
   - Klik ikon pensil pada card field
   - Membuka modal Field Form dengan data yang ada

2. **Modifikasi Field**
   - Edit properti field apa pun
   - Catatan: Perubahan tipe field mungkin memerlukan migrasi data
   - Klik "Save Field"

3. **Proses Backend**
   - **Panggilan API**: `PUT /content/fields/{field_id}`
   - **Validasi**: Memvalidasi keunikan nama field
   - **Database**: Memperbarui record `ContentField`
   - **Response**: Mengembalikan ContentField yang diperbarui

4. **Pembaruan UI**
   - Card field diperbarui dengan informasi baru
   - Modal ditutup

### Alur Kerja: Menghapus Field

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari tab Fields
   - Klik ikon tempat sampah pada card field
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Pengguna mengonfirmasi penghapusan
   - Sistem memeriksa apakah field memiliki data di entri

3. **Proses Backend**
   - **Panggilan API**: `DELETE /content/fields/{field_id}`
   - **Validasi**: Memeriksa apakah field digunakan di entri
   - **Database**: Soft delete record `ContentField`
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Field dihapus dari daftar
   - Jika field memiliki data, sistem mungkin meminta penanganan data

### Alur Kerja: Melihat Aturan Validasi Field

#### Proses Langkah demi Langkah

1. **Akses Halaman Validasi**
   - Dari tab Fields
   - Klik ikon "View Validation Rules" (FileText)
   - Navigasi ke: `/content-builder/{id}/fields/{field_id}/validation`

2. **Melihat Aturan Validasi**
   - Halaman menampilkan tabel semua aturan validasi:
     - Nama Field
     - Tipe Field
     - Status Required
     - Status Unique
     - Min/Max Length
     - Pattern
     - Min/Max Value
     - Default Value
     - Placeholder
     - Help Text

3. **Proses Backend**
   - **Panggilan API**: `GET /content/fields/{field_id}/validation`
   - **Response**: Mengembalikan objek ValidationRules

4. **Tindakan yang Tersedia**
   - Klik "Edit Field" untuk memodifikasi aturan validasi

### Alur Kerja: Melihat Referensi API

#### Proses Langkah demi Langkah

1. **Akses Referensi API**
   - Dari halaman detail Content Type
   - Klik card "API Reference" di Quick Actions
   - Navigasi ke: `/content-builder/{id}/api-reference`

2. **Melihat Dokumentasi API**
   - **Card Info API**: Menampilkan nama Content Type, slug, base URL
   - **Tabel Fields**: Menampilkan semua field dengan tipe dan validasi
   - **Bagian Endpoints**: Menampilkan endpoint REST API:
     - `GET /content/{slug}/entries` - Daftar entri
     - `GET /content/{slug}/entries/{id}` - Mendapatkan entri
     - `POST /content/{slug}/entries` - Membuat entri
     - `PUT /content/{slug}/entries/{id}` - Memperbarui entri
     - `DELETE /content/{slug}/entries/{id}` - Menghapus entri
   - **Contoh Request/Response**: Contoh JSON untuk setiap endpoint
   - **Copy to Clipboard**: Klik untuk menyalin contoh kode

3. **Opsi Download**
   - **Download OpenAPI Spec**: Mengunduh file YAML
   - **Download Markdown Docs**: Mengunduh dokumentasi Markdown

4. **Proses Backend**
   - **Panggilan API**: `GET /content/types/{id}/api-reference`
   - **Response**: Mengembalikan objek APIReference dengan endpoint dan contoh

### Alur Kerja: Menghapus Content Type

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari halaman list Content Type
   - Klik ikon tempat sampah pada baris content type
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Sistem memeriksa apakah content type memiliki entri
   - Jika ada entri, memperingatkan pengguna
   - Pengguna mengonfirmasi penghapusan

3. **Proses Backend**
   - **Panggilan API**: `DELETE /content/types/{id}`
   - **Validasi**: Memeriksa entri yang ada
   - **Database**: Soft delete `ContentType` dan field terkait
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Content type dihapus dari daftar
   - Pengguna diarahkan ke halaman list Content Builder

---

## Content Management

### Gambaran Umum
Content Management memungkinkan pengguna untuk membuat, mengedit, melihat, dan mengelola entri konten berdasarkan Content Types yang didefinisikan di Content Builder. Menangani data konten aktual, bukan schema.

### Alur Kerja: Membuat Entri Konten

#### Proses Langkah demi Langkah

1. **Navigasi ke Content Management**
   - Pengguna klik "Content Management" di sidebar
   - Halaman menampilkan: `/content-management`
   - Menampilkan grid card Content Type

2. **Memilih Content Type**
   - Pengguna klik pada card Content Type (contoh: "Article", "Product")
   - Navigasi ke: `/content-management/{content_type_id}`
   - Menampilkan daftar entri yang ada untuk tipe tersebut

3. **Inisiasi Pembuatan**
   - Pengguna klik tombol "Create New Entry"
   - Navigasi ke: `/content-management/{content_type_id}/create`

4. **Mengisi Form Entri**
   - Form dibuat secara dinamis berdasarkan field Content Type
   - **Field Regular**: Semua field non-SEO ditampilkan
   - **Field SEO** (jika diaktifkan): Meta title, description, image, slug
   - **Validasi Field**: Validasi real-time berdasarkan aturan field
   - **Media Field**: Membuka media picker saat diklik
   - **Relation Field**: Membuka content selector

5. **Perilaku Form**
   - **Field Wajib**: Ditandai dengan asterisk, divalidasi saat submit
   - **Tipe Field**: Merender input yang sesuai (text, textarea, select, dll.)
   - **Default Values**: Terisi otomatis jika didefinisikan di konfigurasi field
   - **Help Text**: Ditampilkan di bawah field

6. **Submit Entri**
   - Pengguna klik "Create Entry"
   - Validasi client-side berjalan
   - Jika valid, form di-submit

7. **Proses Backend**
   - **Panggilan API**: `POST /content/{content_type_id}/entries`
   - **Request Body**: JSON dengan nilai field
   - **Validasi**: Server memvalidasi semua aturan field
   - **Penetapan Status**: Entri dibuat dengan status "draft"
   - **Database**: Membuat record `ContentEntry`
   - **Response**: Mengembalikan ContentEntry yang dibuat beserta ID

8. **Pengalihan**
   - Pengguna diarahkan ke: `/content-management/{content_type_id}/entries/{entry_id}`
   - Menampilkan halaman detail entri

### Alur Kerja: Mengedit Entri Konten

#### Proses Langkah demi Langkah

1. **Akses Detail Entri**
   - Dari daftar entri atau hasil pencarian
   - Klik pada baris entri atau judul
   - Navigasi ke: `/content-management/{content_type_id}/entries/{entry_id}`

2. **Inisiasi Edit**
   - Klik tombol "Edit Content" (orange)
   - Halaman beralih ke mode edit
   - Form terisi dengan data yang ada

3. **Modifikasi Entri**
   - Edit nilai field apa pun
   - **Pelestarian Status**: Status tetap tidak berubah (workflow dikelola terpisah)
   - **Validasi**: Validasi real-time berlaku

4. **Simpan Perubahan**
   - Klik "Save Changes"
   - Validasi client-side berjalan

5. **Proses Backend**
   - **Panggilan API**: `PUT /content/entries/{entry_id}`
   - **Request Body**: JSON dengan nilai field yang diperbarui
   - **Validasi**: Server memvalidasi aturan field
   - **Status**: Status yang ada dipertahankan
   - **Updated By**: Sistem melacak ID pengguna yang memperbarui
   - **Database**: Memperbarui record `ContentEntry`
   - **Response**: Mengembalikan ContentEntry yang diperbarui

6. **Pembaruan UI**
   - Halaman beralih kembali ke mode view
   - Data yang diperbarui ditampilkan
   - Pesan sukses ditampilkan

### Alur Kerja: Melihat Detail Entri

#### Proses Langkah demi Langkah

1. **Akses Detail Entri**
   - Navigasi ke: `/content-management/{content_type_id}/entries/{entry_id}`

2. **Melihat Informasi Entri**
   - **Bagian Header**: Judul entri, badge status, tanggal dibuat/diperbarui
   - **Data Konten**: Semua nilai field ditampilkan
   - **Metadata**: Creator, updater, tanggal publish (jika dipublikasikan)
   - **Tindakan**: Tombol Edit, SEO Preview, Manage Workflow

3. **Bagian Related Entries**
   - Menampilkan entri terkait berdasarkan relasi
   - Menampilkan card dengan judul entri, status, tanggal pembuatan
   - Klik "View" untuk navigasi ke entri terkait

4. **Proses Backend**
   - **Panggilan API**: `GET /content/entries/{entry_id}`
   - **Response**: Mengembalikan ContentEntry dengan data lengkap

### Alur Kerja: Menghapus Entri

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari halaman list entri
   - Klik ikon tempat sampah pada baris entri
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Pengguna mengonfirmasi penghapusan
   - Sistem memeriksa apakah entri memiliki relasi

3. **Proses Backend**
   - **Panggilan API**: `DELETE /content/entries/{entry_id}`
   - **Validasi**: Memeriksa relasi yang ada
   - **Database**: Soft delete record `ContentEntry`
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Entri dihapus dari daftar
   - Pengguna tetap di halaman list entri

### Alur Kerja: SEO Preview

#### Proses Langkah demi Langkah

1. **Akses SEO Preview**
   - Dari halaman detail entri
   - Klik tombol "SEO Preview" (teal)
   - Membuka modal SEO Preview

2. **Melihat Preview SEO**
   - **Tab yang Tersedia**:
     - **Google**: Preview hasil pencarian
     - **Facebook**: Preview Open Graph
     - **Twitter**: Preview Twitter Card
     - **LinkedIn**: Preview LinkedIn
     - **Metadata**: Tag metadata mentah

3. **Data SEO yang Ditampilkan**
   - **Title**: Meta title atau judul entri
   - **Description**: Meta description atau excerpt
   - **Image**: Meta image atau featured image
   - **URL**: Canonical URL
   - **Card Type**: Tipe Twitter card (jika berlaku)

4. **Proses Backend**
   - **Panggilan API**: `GET /content/entries/{entry_id}/seo-preview`
   - **Response**: Mengembalikan data preview SEO

5. **Tindakan yang Tersedia**
   - Klik "Edit SEO Fields" untuk memodifikasi data SEO
   - Tutup modal untuk kembali ke detail entri

### Alur Kerja: Filter dan Pencarian Entri

#### Proses Langkah demi Langkah

1. **Akses List Entri**
   - Navigasi ke: `/content-management/{content_type_id}`

2. **Pencarian Entri**
   - Masukkan query pencarian di search bar
   - Mencari di judul, deskripsi, dan field konten
   - Hasil diperbarui secara real-time

3. **Filter berdasarkan Status**
   - Pilih status dari dropdown
   - Opsi: All, Draft, In Review, Ready for Approval, Approved, Published, Rejected
   - Hasil difilter segera

4. **Filter berdasarkan Creator**
   - Pilih creator dari dropdown
   - Menampilkan entri yang dibuat oleh pengguna yang dipilih

5. **Proses Backend**
   - **Panggilan API**: `GET /content/{content_type_id}/entries?status={status}&created_by={user_id}&search={query}`
   - **Response**: Mengembalikan daftar entri yang difilter

---

## Content Relations

### Gambaran Umum
Content Relations memungkinkan pengguna untuk membuat dan mengelola relasi antar entri konten. Mendukung berbagai tipe relasi: belongs_to, has_many, has_one, many_to_many, dan related.

### Alur Kerja: Membuat Relasi Konten

#### Proses Langkah demi Langkah

1. **Navigasi ke Content Relations**
   - Pengguna klik "Content Relations" di sidebar
   - Halaman menampilkan: `/content-relations`
   - Menampilkan daftar relasi yang ada

2. **Inisiasi Pembuatan**
   - Pengguna klik tombol "Create Relation"
   - Membuka modal "Create New Relation"

3. **Mengisi Form Relasi**
   - **From Entry**: Pilih entri sumber (dropdown atau pencarian)
   - **Tipe Relasi**: Pilih dari dropdown:
     - `belongs_to` - Entri termasuk ke entri lain
     - `has_many` - Entri memiliki banyak entri terkait
     - `has_one` - Entri memiliki satu entri terkait
     - `many_to_many` - Relasi many-to-many
     - `related` - Entri terkait umum
   - **To Entry**: Pilih entri target (dropdown atau pencarian)
   - **Submit**: Klik "Create Relation"

4. **Proses Backend**
   - **Panggilan API**: `POST /content/{from_content_id}/relations`
   - **Request Body**: `{ to_content_id, relation_type }`
   - **Validasi**: Memeriksa apakah entri ada, memvalidasi tipe relasi
   - **Database**: Membuat record `ContentRelation`
   - **Response**: Mengembalikan ContentRelation yang dibuat

5. **Pembaruan UI**
   - Modal ditutup
   - Relasi baru muncul di tabel relasi
   - Pesan sukses ditampilkan

### Alur Kerja: Melihat Relasi Entri

#### Proses Langkah demi Langkah

1. **Akses Relasi Entri**
   - Dari halaman Content Relations
   - Klik ikon mata pada baris relasi
   - Navigasi ke: `/content-relations/{entry_id}`

2. **Melihat Relasi**
   - Halaman menampilkan semua relasi untuk entri yang dipilih
   - **Relasi Keluar**: Relasi di mana entri adalah "from"
   - **Relasi Masuk**: Relasi di mana entri adalah "to"
   - Menampilkan tipe relasi, judul entri terkait, status

3. **Proses Backend**
   - **Panggilan API**: `GET /content/{entry_id}/relations`
   - **Response**: Mengembalikan daftar objek ContentRelation

### Alur Kerja: Menghapus Relasi

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari halaman Content Relations
   - Klik ikon tempat sampah pada baris relasi
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Pengguna mengonfirmasi penghapusan

3. **Proses Backend**
   - **Panggilan API**: `DELETE /content/relations/{relation_id}`
   - **Database**: Menghapus record `ContentRelation`
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Relasi dihapus dari tabel
   - Pesan sukses ditampilkan

### Alur Kerja: Filter Relasi

#### Proses Langkah demi Langkah

1. **Pencarian Relasi**
   - Masukkan query pencarian di search bar
   - Mencari judul entri dalam relasi
   - Hasil diperbarui secara real-time

2. **Filter berdasarkan Tipe Relasi**
   - Pilih tipe relasi dari dropdown
   - Opsi: All Types, Belongs To, Has Many, Has One, Many to Many, Related
   - Hasil difilter segera

3. **Filter berdasarkan Content Type**
   - Pilih content type dari dropdown
   - Menampilkan relasi yang melibatkan content type yang dipilih

4. **Proses Backend**
   - **Panggilan API**: `GET /content/{entry_id}/relations?type={relation_type}&content_type={id}`
   - **Response**: Mengembalikan daftar relasi yang difilter

---

## Assets Media

### Gambaran Umum
Media Library mengelola semua asset media (gambar, video, dokumen, dll.) yang digunakan di seluruh CMS. Menyediakan organisasi melalui folder, pencarian, dan kemampuan filtering.

### Alur Kerja: Upload Media

#### Proses Langkah demi Langkah

1. **Navigasi ke Media Library**
   - Pengguna klik "Media Library" di sidebar
   - Halaman menampilkan: `/assets`
   - Menampilkan grid/list file media

2. **Inisiasi Upload**
   - Pengguna klik tombol "Upload Media"
   - Navigasi ke: `/assets/upload`

3. **Memilih File**
   - **Single Upload**: Klik untuk memilih file
   - **Bulk Upload**: Pilih beberapa file
   - **Drag & Drop**: Seret file ke area upload
   - **Tipe File yang Didukung**: Gambar, video, dokumen, PDF

4. **Konfigurasi Upload**
   - **Folder**: Pilih folder tujuan (opsional)
   - **Alt Text**: Masukkan teks alt untuk aksesibilitas
   - **Caption**: Masukkan caption/deskripsi
   - **Klik Upload**: Memulai proses upload

5. **Progress Upload**
   - Progress bar menampilkan status upload
   - Beberapa file di-upload secara berurutan atau paralel

6. **Proses Backend**
   - **Panggilan API**: `POST /media/upload` (single) atau `POST /media/bulk-upload` (multiple)
   - **Request**: Multipart form data dengan file
   - **Pemrosesan File**:
     - Memvalidasi tipe dan ukuran file
     - Membuat thumbnail (untuk gambar)
     - Menyimpan file di sistem penyimpanan
     - Membuat record database
   - **Database**: Membuat record `MediaFile`
   - **Response**: Mengembalikan MediaFile yang dibuat

7. **Pengalihan**
   - Pengguna diarahkan ke: `/assets`
   - File yang di-upload muncul di media library
   - Pesan sukses ditampilkan

### Alur Kerja: Membuat Folder

#### Proses Langkah demi Langkah

1. **Inisiasi Pembuatan Folder**
   - Dari halaman Media Library
   - Klik tombol "Create Folder"
   - ATAU klik kanan di folder tree dan pilih "New Folder"
   - Membuka modal "Create Folder"

2. **Mengisi Form Folder**
   - **Nama Folder**: Masukkan nama folder
   - **Parent Folder**: Pilih folder induk (opsional, untuk folder bersarang)
   - **Submit**: Klik "Create Folder"

3. **Proses Backend**
   - **Panggilan API**: `POST /media/folders`
   - **Request Body**: `{ name, parent_id }`
   - **Validasi**: Memeriksa keunikan nama dalam folder induk
   - **Database**: Membuat record `MediaFolder`
   - **Response**: Mengembalikan MediaFolder yang dibuat

4. **Pembaruan UI**
   - Modal ditutup
   - Folder baru muncul di folder tree
   - Pesan sukses ditampilkan

### Alur Kerja: Mengorganisir Media ke Folder

#### Proses Langkah demi Langkah

1. **Memilih File Media**
   - Dari grid atau list view
   - Pilih satu atau beberapa file

2. **Pindah ke Folder**
   - Klik kanan file yang dipilih
   - ATAU gunakan tombol aksi move
   - Pilih folder tujuan dari dropdown
   - Konfirmasi pindah

3. **Proses Backend**
   - **Panggilan API**: `PUT /media/{id}` untuk setiap file
   - **Request Body**: `{ folder_id }`
   - **Database**: Memperbarui record `MediaFile`
   - **Response**: Mengembalikan MediaFile yang diperbarui

4. **Pembaruan UI**
   - File dipindahkan ke folder yang dipilih
   - Tampilan folder diperbarui
   - Pesan sukses ditampilkan

### Alur Kerja: Mengedit Metadata Media

#### Proses Langkah demi Langkah

1. **Akses Detail Media**
   - Dari Media Library
   - Klik pada file media
   - Navigasi ke: `/assets/{id}`

2. **Inisiasi Edit**
   - Klik tombol "Edit"
   - Navigasi ke: `/assets/{id}/edit`

3. **Modifikasi Metadata**
   - **Nama File**: Edit nama tampilan
   - **Alt Text**: Edit teks alt
   - **Caption**: Edit caption/deskripsi
   - **Folder**: Ubah lokasi folder
   - **Tags**: Tambah/hapus tag

4. **Simpan Perubahan**
   - Klik "Save Changes"

5. **Proses Backend**
   - **Panggilan API**: `PUT /media/{id}`
   - **Request Body**: JSON dengan metadata yang diperbarui
   - **Database**: Memperbarui record `MediaFile`
   - **Response**: Mengembalikan MediaFile yang diperbarui

6. **Pengalihan**
   - Pengguna diarahkan ke: `/assets/{id}`
   - Metadata yang diperbarui ditampilkan

### Alur Kerja: Menghapus Media

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari Media Library atau halaman detail
   - Klik ikon tempat sampah
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Pengguna mengonfirmasi penghapusan
   - Sistem memeriksa apakah media digunakan di entri

3. **Proses Backend**
   - **Panggilan API**: `DELETE /media/{id}`
   - **Validasi**: Memeriksa referensi di entri
   - **Penghapusan File**: Menghapus file dari penyimpanan
   - **Penghapusan Thumbnail**: Menghapus thumbnail yang dibuat
   - **Database**: Soft delete record `MediaFile`
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Media dihapus dari library
   - Jika digunakan di entri, sistem mungkin memperingatkan pengguna

### Alur Kerja: Pencarian dan Filter Media

#### Proses Langkah demi Langkah

1. **Pencarian Media**
   - Masukkan query pencarian di search bar
   - Mencari nama file, alt text, caption
   - Hasil diperbarui secara real-time

2. **Filter berdasarkan Tipe**
   - Pilih tipe media dari dropdown:
     - All Types
     - Images
     - Videos
     - Documents
     - Audio
   - Hasil difilter segera

3. **Filter berdasarkan Folder**
   - Klik folder di folder tree
   - Menampilkan hanya media di folder yang dipilih
   - Klik "All" untuk menampilkan semua media

4. **Toggle View Mode**
   - Grid View: Layout grid thumbnail
   - List View: Tabel dengan detail

5. **Proses Backend**
   - **Panggilan API**: `GET /media/search?query={query}&type={type}&folder={folder_id}`
   - **Response**: Mengembalikan daftar file media yang difilter

---

## Workflow Management

### Gambaran Umum
Workflow Management menangani proses persetujuan konten, memungkinkan pengguna untuk mengubah status konten, meminta review, menyetujui/menolak entri, dan memublikasikan konten. Menegakkan transisi berbasis role dan mempertahankan audit trail lengkap.

### Status Alur Kerja

Sistem menggunakan alur status berikut:
1. **draft** → Status awal untuk entri baru
2. **in_review** → Entri dikirim untuk review
3. **ready_for_approval** → Entri siap untuk persetujuan manager
4. **approved** → Entri disetujui oleh manager
5. **published** → Entri dipublikasikan dan live
6. **rejected** → Entri ditolak, bisa kembali ke draft

### Alur Kerja: Request Review

#### Proses Langkah demi Langkah

1. **Akses Workflow Management**
   - Dari halaman detail entri
   - Klik tombol "Manage Workflow"
   - Navigasi ke: `/workflow-management/{entry_id}`

2. **Melihat Status Saat Ini**
   - Halaman menampilkan detail entri
   - Badge status saat ini ditampilkan
   - Tindakan yang tersedia berdasarkan status dan role pengguna

3. **Request Review**
   - Jika status adalah "draft"
   - Klik tombol "Request Review"
   - Opsional: Tambah komentar menjelaskan perubahan
   - Klik "Submit"

4. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/request-review`
   - **Request Body**: `{ comment }`
   - **Validasi**: 
     - Memeriksa role pengguna (editor, admin)
     - Memvalidasi transisi dari "draft" ke "in_review"
   - **Perubahan Status**: Memperbarui status entri ke "in_review"
   - **History**: Membuat record `WorkflowHistory`
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui dan record history

5. **Pembaruan UI**
   - Badge status diperbarui ke "In Review"
   - Workflow history diperbarui
   - Pesan sukses ditampilkan

### Alur Kerja: Approve Entry

#### Proses Langkah demi Langkah

1. **Akses Entri**
   - Dari Workflow Management atau Approval Queue
   - Navigasi ke detail entri: `/workflow-management/{entry_id}`

2. **Review Entri**
   - Pengguna meninjau konten entri
   - Memeriksa workflow history dan komentar

3. **Approve Entri**
   - Jika status adalah "ready_for_approval"
   - Klik tombol "Approve" (hijau)
   - Opsional: Tambah komentar persetujuan
   - Klik "Confirm Approval"

4. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/approve`
   - **Request Body**: `{ comment }`
   - **Validasi**: 
     - Memeriksa role pengguna (manager, admin)
     - Memvalidasi transisi dari "ready_for_approval" ke "approved"
   - **Perubahan Status**: Memperbarui status entri ke "approved"
   - **History**: Membuat record `WorkflowHistory`
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui

5. **Pembaruan UI**
   - Badge status diperbarui ke "Approved"
   - Workflow history diperbarui
   - Pesan sukses ditampilkan

### Alur Kerja: Reject Entry

#### Proses Langkah demi Langkah

1. **Akses Entri**
   - Dari Workflow Management atau Approval Queue
   - Navigasi ke detail entri

2. **Review Entri**
   - Pengguna meninjau konten entri
   - Mengidentifikasi masalah atau perubahan yang diperlukan

3. **Reject Entri**
   - Klik tombol "Reject" (merah)
   - **Wajib**: Tambah komentar penolakan menjelaskan alasan
   - Klik "Confirm Rejection"

4. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/reject`
   - **Request Body**: `{ comment }` (wajib)
   - **Validasi**: 
     - Memeriksa role pengguna (manager, admin)
     - Memvalidasi transisi dari "ready_for_approval" ke "rejected"
   - **Perubahan Status**: Memperbarui status entri ke "rejected"
   - **History**: Membuat record `WorkflowHistory` dengan alasan penolakan
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui

5. **Pembaruan UI**
   - Badge status diperbarui ke "Rejected"
   - Workflow history diperbarui dengan komentar penolakan
   - Pesan sukses ditampilkan

### Alur Kerja: Publish Entry

#### Proses Langkah demi Langkah

1. **Akses Entri**
   - Dari Workflow Management
   - Navigasi ke detail entri

2. **Review Entri**
   - Pengguna meninjau entri yang disetujui
   - Memverifikasi konten siap untuk publikasi

3. **Publish Entri**
   - Jika status adalah "approved"
   - Klik tombol "Publish" (hijau)
   - Opsional: Tambah komentar publikasi
   - Klik "Confirm Publish"

4. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/publish`
   - **Request Body**: `{ comment }`
   - **Validasi**: 
     - Memeriksa role pengguna (manager, admin)
     - Memvalidasi transisi dari "approved" ke "published"
   - **Perubahan Status**: Memperbarui status entri ke "published"
   - **Tanggal Publish**: Mengatur timestamp `publishedAt`
   - **History**: Membuat record `WorkflowHistory`
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui

5. **Pembaruan UI**
   - Badge status diperbarui ke "Published"
   - Tanggal publish ditampilkan
   - Workflow history diperbarui
   - Pesan sukses ditampilkan

### Alur Kerja: Change Status Manual

#### Proses Langkah demi Langkah

1. **Akses Entri**
   - Dari Workflow Management
   - Navigasi ke detail entri

2. **Melihat Transisi yang Tersedia**
   - Sistem menampilkan transisi status yang tersedia berdasarkan:
     - Status saat ini
     - Role pengguna
     - Aturan transisi workflow

3. **Memilih Status Baru**
   - Klik dropdown atau tombol status
   - Pilih status target
   - Tambah komentar opsional

4. **Submit Perubahan Status**
   - Klik "Change Status"
   - Sistem memvalidasi transisi

5. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/status`
   - **Request Body**: `{ status, comment }`
   - **Validasi**: 
     - Memeriksa role pengguna
     - Memvalidasi aturan transisi
     - Memastikan transisi diizinkan
   - **Perubahan Status**: Memperbarui status entri
   - **History**: Membuat record `WorkflowHistory`
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui

6. **Pembaruan UI**
   - Badge status diperbarui
   - Workflow history diperbarui
   - Pesan sukses ditampilkan

### Alur Kerja: Menambah Komentar

#### Proses Langkah demi Langkah

1. **Akses Entri**
   - Dari Workflow Management
   - Navigasi ke detail entri

2. **Melihat Bagian Komentar**
   - Scroll ke bagian komentar
   - Melihat komentar yang ada

3. **Menambah Komentar**
   - Masukkan komentar di text area
   - **Private Comment**: Toggle untuk membuat komentar privat (hanya terlihat oleh author dan admin)
   - Klik "Add Comment"

4. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/comments`
   - **Request Body**: `{ comment, is_private }`
   - **Database**: Membuat record `WorkflowComment`
   - **Response**: Mengembalikan komentar yang dibuat

5. **Pembaruan UI**
   - Komentar muncul di daftar komentar
   - Menampilkan author, timestamp, indikator privasi

### Alur Kerja: Melihat History

#### Proses Langkah demi Langkah

1. **Akses History**
   - Dari detail entri Workflow Management
   - Klik tab "History"
   - ATAU navigasi ke: `/workflow-management/{entry_id}/history`

2. **Melihat Workflow History**
   - Timeline semua perubahan status
   - Menampilkan: Dari status → Ke status
   - Menampilkan: Pengguna, timestamp, komentar
   - Urutan kronologis (terbaru pertama)

3. **Proses Backend**
   - **Panggilan API**: `GET /workflow/entries/{entry_id}/history`
   - **Response**: Mengembalikan daftar record `WorkflowHistory`

### Alur Kerja: Assign Entri

#### Proses Langkah demi Langkah

1. **Akses Entri**
   - Dari Workflow Management
   - Navigasi ke detail entri

2. **Assign ke Pengguna**
   - Klik tombol "Assign"
   - Pilih pengguna dari dropdown
   - Tambah komentar opsional
   - Klik "Assign"

3. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/assign`
   - **Request Body**: `{ user_id, comment }`
   - **Database**: Membuat record assignment
   - **Response**: Mengembalikan detail assignment

4. **Pembaruan UI**
   - Assignment ditampilkan di detail entri
   - Pengguna yang ditugaskan diberitahu (jika notifikasi diaktifkan)

### Alur Kerja: Filter berdasarkan Status

#### Proses Langkah demi Langkah

1. **Akses Workflow Management**
   - Navigasi ke: `/workflow-management`
   - Menampilkan daftar semua entri

2. **Filter berdasarkan Status**
   - Pilih status dari dropdown
   - Opsi: All, Draft, In Review, Ready for Approval, Approved, Published, Rejected
   - Hasil difilter segera

3. **Filter berdasarkan Content Type**
   - Pilih content type dari dropdown
   - Menampilkan entri untuk content type yang dipilih

4. **Proses Backend**
   - **Panggilan API**: `GET /workflow/content-types/{content_type_id}/entries?status={status}`
   - **Response**: Mengembalikan daftar entri yang difilter

---

## Approval Queue

### Gambaran Umum
Approval Queue menyediakan tampilan fokus pada entri yang memerlukan persetujuan (status: "ready_for_approval"). Memungkinkan manager untuk dengan cepat meninjau dan menyetujui/menolak beberapa entri secara efisien.

### Alur Kerja: Melihat Approval Queue

#### Proses Langkah demi Langkah

1. **Navigasi ke Approval Queue**
   - Pengguna klik "Approval Queue" di sidebar
   - Halaman menampilkan: `/approval-queue`
   - Menampilkan hanya entri dengan status "ready_for_approval"

2. **Melihat Pending Approvals**
   - **List View**: Tabel menampilkan:
     - Judul entri
     - Content type
     - Creator
     - Tanggal dibuat
     - Badge status
     - Tindakan (Approve/Reject)
   - **Stats Cards**: Menampilkan jumlah pending approvals

3. **Proses Backend**
   - **Panggilan API**: `GET /workflow/content-types/{content_type_id}/entries?status=ready_for_approval`
   - **Response**: Mengembalikan daftar entri yang menunggu persetujuan

### Alur Kerja: Approve dari Queue

#### Proses Langkah demi Langkah

1. **Review Entri**
   - Dari halaman Approval Queue
   - Klik pada baris entri untuk melihat detail
   - Navigasi ke: `/approval-queue/{entry_id}`

2. **Quick Approve**
   - Dari list queue: Klik tombol "Approve" pada baris
   - ATAU dari halaman detail: Klik tombol "Approve"
   - Opsional: Tambah komentar
   - Klik "Confirm"

3. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/approve`
   - **Request Body**: `{ comment }`
   - **Validasi**: Memeriksa role pengguna (manager, admin)
   - **Perubahan Status**: Memperbarui ke "approved"
   - **History**: Membuat record `WorkflowHistory`
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui

4. **Pembaruan UI**
   - Entri dihapus dari approval queue
   - Pesan sukses ditampilkan
   - Count queue diperbarui

### Alur Kerja: Reject dari Queue

#### Proses Langkah demi Langkah

1. **Review Entri**
   - Dari halaman Approval Queue
   - Klik pada baris entri untuk melihat detail

2. **Reject Entri**
   - Klik tombol "Reject"
   - **Wajib**: Tambah komentar penolakan
   - Klik "Confirm"

3. **Proses Backend**
   - **Panggilan API**: `POST /workflow/entries/{entry_id}/reject`
   - **Request Body**: `{ comment }` (wajib)
   - **Validasi**: Memeriksa role pengguna (manager, admin)
   - **Perubahan Status**: Memperbarui ke "rejected"
   - **History**: Membuat record `WorkflowHistory`
   - **Database**: Memperbarui `ContentEntry` dan membuat `WorkflowHistory`
   - **Response**: Mengembalikan entri yang diperbarui

4. **Pembaruan UI**
   - Entri dihapus dari approval queue
   - Pesan sukses ditampilkan
   - Count queue diperbarui

### Alur Kerja: Bulk Actions

#### Proses Langkah demi Langkah

1. **Memilih Beberapa Entri**
   - Dari halaman Approval Queue
   - Centang kotak di samping entri
   - Pilih beberapa entri

2. **Bulk Approve**
   - Klik tombol "Bulk Approve"
   - Dialog konfirmasi muncul
   - Klik "Confirm"

3. **Proses Backend**
   - **Panggilan API**: Beberapa panggilan `POST /workflow/entries/{entry_id}/approve`
   - **Database**: Memperbarui beberapa entri
   - **Response**: Mengembalikan ringkasan hasil

4. **Pembaruan UI**
   - Entri yang dipilih dihapus dari queue
   - Pesan sukses ditampilkan
   - Count queue diperbarui

---

## User Management

### Gambaran Umum
User Management memungkinkan administrator untuk membuat, mengedit, melihat, dan mengelola akun pengguna. Menangani pembuatan pengguna, penetapan role, manajemen status, dan informasi profil pengguna.

### Alur Kerja: Membuat User

#### Proses Langkah demi Langkah

1. **Navigasi ke User Management**
   - Pengguna klik "User Management" di sidebar
   - Halaman menampilkan: `/user-management`
   - Menampilkan daftar semua pengguna

2. **Inisiasi Pembuatan**
   - Klik tombol "Add New User"
   - Navigasi ke: `/user-management/create`

3. **Mengisi Form User**
   - **Name**: Masukkan nama lengkap pengguna
   - **Email**: Masukkan alamat email (harus unik)
   - **Password**: Masukkan password (di-hash di backend)
   - **Provider**: Pilih provider autentikasi (local, google, dll.)
   - **Role**: Pilih role dari dropdown
   - **Status**: Pilih status (active/inactive)
   - **Profile Picture**: Upload gambar profil (opsional)

4. **Submit User**
   - Klik "Create User"
   - Validasi client-side berjalan

5. **Proses Backend**
   - **Panggilan API**: `POST /users`
   - **Request Body**: `{ name, email, password, provider, role_id, status, profile }`
   - **Validasi**: 
     - Memeriksa keunikan email
     - Memvalidasi kekuatan password
     - Memvalidasi role ada
   - **Password Hashing**: Password di-hash menggunakan bcrypt
   - **Database**: Membuat record `User`
   - **Response**: Mengembalikan User yang dibuat (tanpa password)

6. **Pengalihan**
   - Pengguna diarahkan ke: `/user-management/{user_id}`
   - Menampilkan halaman detail pengguna

### Alur Kerja: Mengedit User

#### Proses Langkah demi Langkah

1. **Akses Detail User**
   - Dari list pengguna
   - Klik pada baris pengguna atau ikon mata
   - Navigasi ke: `/user-management/{user_id}`

2. **Inisiasi Edit**
   - Klik tombol "Edit User" (orange)
   - Navigasi ke: `/user-management/{user_id}/edit`

3. **Modifikasi User**
   - Edit field pengguna apa pun
   - **Password**: Opsional, kosongkan untuk mempertahankan yang ada
   - **Role**: Ubah role pengguna
   - **Status**: Ubah status pengguna

4. **Simpan Perubahan**
   - Klik "Save Changes"

5. **Proses Backend**
   - **Panggilan API**: `PUT /users/{id}`
   - **Request Body**: JSON dengan field yang diperbarui
   - **Validasi**: 
     - Memeriksa keunikan email (jika diubah)
     - Memvalidasi kekuatan password (jika diubah)
     - Memvalidasi role ada
   - **Password Hashing**: Password di-hash jika diubah
   - **Database**: Memperbarui record `User`
   - **Response**: Mengembalikan User yang diperbarui

6. **Pengalihan**
   - Pengguna diarahkan ke: `/user-management/{user_id}`
   - Informasi yang diperbarui ditampilkan

### Alur Kerja: Melihat Detail User

#### Proses Langkah demi Langkah

1. **Akses Detail User**
   - Navigasi ke: `/user-management/{user_id}`

2. **Melihat Informasi User**
   - **Bagian Profile**: Avatar, nama, email, provider
   - **Informasi Role**: Nama role, badge, deskripsi
   - **Status**: Badge Active/Inactive
   - **Metadata**: Tanggal dibuat, tanggal diperbarui
   - **Tindakan**: Tombol Edit, Delete

3. **Proses Backend**
   - **Panggilan API**: `GET /users/{id}`
   - **Response**: Mengembalikan User dengan informasi role

### Alur Kerja: Menghapus User

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari list pengguna atau halaman detail
   - Klik ikon tempat sampah
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Pengguna mengonfirmasi penghapusan
   - Sistem memeriksa apakah pengguna telah membuat konten

3. **Proses Backend**
   - **Panggilan API**: `DELETE /users/{id}`
   - **Validasi**: Memeriksa konten terkait
   - **Database**: Soft delete record `User`
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Pengguna dihapus dari daftar
   - Pesan sukses ditampilkan

### Alur Kerja: Assign Role ke User

#### Proses Langkah demi Langkah

1. **Akses Edit User**
   - Navigasi ke halaman edit pengguna

2. **Ubah Role**
   - Pilih role baru dari dropdown
   - Klik "Save Changes"

3. **Proses Backend**
   - **Panggilan API**: `PUT /users/{id}` dengan `role_id` yang diperbarui
   - **Database**: Memperbarui `User.role_id`
   - **Response**: Mengembalikan User yang diperbarui

4. **Pembaruan UI**
   - Badge role diperbarui
   - Permission pengguna diperbarui berdasarkan role baru

### Alur Kerja: Filter dan Pencarian Pengguna

#### Proses Langkah demi Langkah

1. **Pencarian Pengguna**
   - Masukkan query pencarian di search bar
   - Mencari nama dan email
   - Hasil diperbarui secara real-time

2. **Filter berdasarkan Status**
   - Pilih status dari dropdown: All, Active, Inactive
   - Hasil difilter segera

3. **Filter berdasarkan Role**
   - Pilih role dari dropdown
   - Menampilkan pengguna dengan role yang dipilih

4. **Proses Backend**
   - **Panggilan API**: `GET /users?search={query}&status={status}&role={role_id}`
   - **Response**: Mengembalikan daftar pengguna yang difilter

---

## Role & Permissions

### Gambaran Umum
Role & Permissions memungkinkan administrator untuk mendefinisikan role dan menetapkan permission yang granular. Permission mengontrol akses ke modul, tindakan, dan field spesifik dalam CMS.

### Struktur Permission

Permission terdiri dari:
- **Module**: Fitur/modul (contoh: "ContentEntry", "Media", "SEO")
- **Action**: Operasi (contoh: "create", "read", "update", "delete", "approve")
- **Field Scope**: Kontrol akses level field ("all", "seo_only", "non_seo_only", "custom")
- **Allowed Fields**: Field spesifik yang bisa diakses pengguna (jika field_scope adalah "custom")
- **Denied Fields**: Field spesifik yang tidak bisa diakses pengguna
- **Content Type IDs**: Membatasi permission ke content type spesifik

### Alur Kerja: Membuat Role

#### Proses Langkah demi Langkah

1. **Navigasi ke Role & Permissions**
   - Pengguna klik "Role & Permissions" di sidebar
   - Halaman menampilkan: `/role-permissions`
   - Menampilkan daftar semua role

2. **Inisiasi Pembuatan**
   - Klik tombol "Create New Role"
   - Navigasi ke: `/role-permissions/create`

3. **Mengisi Form Role**
   - **Role Name**: Masukkan nama role (contoh: "editor", "manager")
   - **Description**: Masukkan deskripsi role
   - **Permissions**: Pilih permission menggunakan permission matrix:
     - **Modul Content Entry**:
       - Create, Read, Update, Delete, Approve
       - Field scope: All, SEO Only, Non-SEO Only, Custom
       - Allowed/Denied fields (jika custom)
       - Pembatasan content type
     - **Modul Media**:
       - Create, Read, Update, Delete
     - **Modul SEO**:
       - Read, Update

4. **Konfigurasi Permissions**
   - Centang/hapus centang permission di matrix
   - Atur field scope untuk permission Content Entry
   - Jika field scope adalah "custom":
     - Pilih allowed fields
     - Pilih denied fields
   - Pilih content types (jika membatasi ke tipe spesifik)

5. **Submit Role**
   - Klik "Create Role"
   - Validasi client-side berjalan

6. **Proses Backend**
   - **Panggilan API**: `POST /roles`
   - **Request Body**: `{ name, description, permissions: [...] }`
   - **Validasi**: 
     - Memeriksa keunikan nama role
     - Memvalidasi struktur permission
   - **Database**: 
     - Membuat record `Role`
     - Membuat record `Permission` untuk setiap permission
   - **Response**: Mengembalikan Role yang dibuat dengan permissions

7. **Pengalihan**
   - Pengguna diarahkan ke: `/role-permissions/{role_id}`
   - Menampilkan halaman detail role

### Alur Kerja: Mengedit Role

#### Proses Langkah demi Langkah

1. **Akses Detail Role**
   - Dari list role
   - Klik pada baris role atau ikon mata
   - Navigasi ke: `/role-permissions/{role_id}`

2. **Inisiasi Edit**
   - Klik tombol "Edit Role" (orange)
   - Navigasi ke: `/role-permissions/{role_id}/edit`

3. **Modifikasi Role**
   - Edit nama role atau deskripsi
   - Modifikasi permission di matrix
   - Tambah atau hapus permission
   - Ubah field scopes
   - Perbarui allowed/denied fields

4. **Simpan Perubahan**
   - Klik "Save Changes"

5. **Proses Backend**
   - **Panggilan API**: `PUT /roles/{id}`
   - **Request Body**: JSON dengan role dan permission yang diperbarui
   - **Validasi**: Memvalidasi struktur permission
   - **Database**: 
     - Memperbarui record `Role`
     - Memperbarui atau membuat record `Permission`
   - **Response**: Mengembalikan Role yang diperbarui

6. **Pengalihan**
   - Pengguna diarahkan ke: `/role-permissions/{role_id}`
   - Informasi yang diperbarui ditampilkan

### Alur Kerja: Duplicate Role

#### Proses Langkah demi Langkah

1. **Inisiasi Duplikasi**
   - Dari list role
   - Klik ikon duplicate (copy) pada baris role
   - Dialog konfirmasi muncul

2. **Konfirmasi Duplikasi**
   - Pengguna mengonfirmasi duplikasi

3. **Proses Backend**
   - **Panggilan API**: `POST /roles/{id}/duplicate`
   - **Database**: 
     - Membuat `Role` baru dengan suffix "- Copy"
     - Menyalin semua record `Permission`
   - **Response**: Mengembalikan Role yang diduplikasi

4. **Pengalihan**
   - Pengguna diarahkan ke: `/role-permissions/{new_role_id}/edit`
   - Dapat memodifikasi role yang diduplikasi
   - Nama terisi dengan suffix "Copy"

### Alur Kerja: Menghapus Role

#### Proses Langkah demi Langkah

1. **Inisiasi Penghapusan**
   - Dari list role atau halaman detail
   - Klik ikon tempat sampah
   - Dialog konfirmasi muncul

2. **Konfirmasi Penghapusan**
   - Sistem memeriksa apakah role ditugaskan ke pengguna
   - Jika ada pengguna, penghapusan diblokir dengan peringatan
   - Pengguna mengonfirmasi penghapusan

3. **Proses Backend**
   - **Panggilan API**: `DELETE /roles/{id}`
   - **Validasi**: Memeriksa apakah role ditugaskan ke pengguna
   - **Database**: 
     - Jika ditugaskan: Mengembalikan error
     - Jika tidak ditugaskan: Soft delete `Role` dan record `Permission` terkait
   - **Response**: Mengembalikan status sukses atau error

4. **Pembaruan UI**
   - Jika berhasil: Role dihapus dari daftar
   - Jika error: Pesan error ditampilkan

### Alur Kerja: Melihat Detail Role

#### Proses Langkah demi Langkah

1. **Akses Detail Role**
   - Navigasi ke: `/role-permissions/{role_id}`

2. **Melihat Informasi Role**
   - **Basic Info**: Nama role, deskripsi
   - **Permission Matrix**: Tabel menampilkan semua permission
   - **Users Count**: Jumlah pengguna dengan role ini
   - **Metadata**: Tanggal dibuat, tanggal diperbarui
   - **Tindakan**: Tombol Edit, Duplicate, Delete

3. **Tampilan Permissions**
   - **Module**: Menampilkan nama modul
   - **Action**: Menampilkan tindakan yang diizinkan
   - **Field Scope**: Menampilkan tipe field scope
   - **Fields**: Menampilkan allowed/denied fields (jika custom)
   - **Content Types**: Menampilkan content types yang dibatasi (jika ada)

4. **Proses Backend**
   - **Panggilan API**: `GET /roles/{id}`
   - **Response**: Mengembalikan Role dengan semua permissions

### Alur Kerja: Assign Role ke User

#### Proses Langkah demi Langkah

1. **Akses Edit User**
   - Navigasi ke halaman edit pengguna

2. **Pilih Role**
   - Pilih role dari dropdown
   - Klik "Save Changes"

3. **Proses Backend**
   - **Panggilan API**: `POST /roles/assign`
   - **Request Body**: `{ user_id, role_id }`
   - **Database**: Memperbarui `User.role_id`
   - **Response**: Mengembalikan status sukses

4. **Pembaruan UI**
   - Role pengguna diperbarui
   - Permission pengguna diperbarui berdasarkan role baru

### Alur Kerja: Filter Role

#### Proses Langkah demi Langkah

1. **Pencarian Role**
   - Masukkan query pencarian di search bar
   - Mencari nama role dan deskripsi
   - Hasil diperbarui secara real-time

2. **Filter berdasarkan Module**
   - Pilih module dari dropdown
   - Opsi: All Modules, Content Entry, Media, SEO
   - Menampilkan role dengan permission untuk module yang dipilih

3. **Proses Backend**
   - **Panggilan API**: `GET /roles?search={query}&module={module}`
   - **Response**: Mengembalikan daftar role yang difilter

---

## Alur Kerja Cross-Feature

### Alur Kerja: Siklus Konten Lengkap

#### Gambaran Umum
Alur kerja ini mendemonstrasikan siklus lengkap konten dari pembuatan hingga publikasi, melibatkan beberapa fitur.

#### Proses Langkah demi Langkah

1. **Content Builder: Membuat Content Type**
   - Admin membuat content type "Article"
   - Menambah field: title, body, featured_image
   - Mengaktifkan SEO: Menambah field meta_title, meta_description

2. **Content Management: Membuat Entri**
   - Editor membuat entri artikel baru
   - Mengisi title, body, featured_image
   - Mengisi field SEO: meta_title, meta_description
   - Entri dibuat dengan status "draft"

3. **Media Library: Upload Gambar**
   - Editor meng-upload featured image
   - Gambar disimpan di Media Library
   - URL gambar direferensikan di entri

4. **Content Management: Edit Entri**
   - Editor mengedit konten entri
   - Memperbarui field sesuai kebutuhan
   - Status tetap "draft"

5. **SEO Preview: Preview SEO**
   - Editor klik "SEO Preview"
   - Melihat preview Google, Facebook, Twitter
   - Memverifikasi metadata SEO

6. **Workflow Management: Request Review**
   - Editor klik "Request Review"
   - Status berubah ke "in_review"
   - Reviewer diberitahu

7. **Workflow Management: Submit untuk Approval**
   - Reviewer meninjau entri
   - Menambah komentar
   - Mengubah status ke "ready_for_approval"
   - Manager diberitahu

8. **Approval Queue: Approve Entri**
   - Manager melihat entri di Approval Queue
   - Meninjau konten dan komentar
   - Menyetujui entri
   - Status berubah ke "approved"

9. **Workflow Management: Publish Entri**
   - Manager memublikasikan entri yang disetujui
   - Status berubah ke "published"
   - Tanggal publish diatur
   - Entri menjadi live

10. **Content Relations: Link Konten Terkait**
    - Admin membuat relasi antar artikel
    - Artikel terkait ditampilkan di halaman entri

11. **Search: Mencari Entri**
    - Pengguna mencari artikel
    - Entri muncul di hasil pencarian
    - Pengguna navigasi ke detail entri

---

## Referensi Endpoint API

### Content Builder
- `POST /content/types` - Membuat content type
- `GET /content/types` - Daftar content types
- `GET /content/types/:id` - Mendapatkan content type
- `PUT /content/types/:id` - Memperbarui content type
- `DELETE /content/types/:id` - Menghapus content type
- `POST /content/types/:id/fields` - Menambah field
- `PUT /content/fields/:field_id` - Memperbarui field
- `DELETE /content/fields/:field_id` - Menghapus field
- `GET /content/fields/:field_id/validation` - Mendapatkan aturan validasi
- `GET /content/types/:id/api-reference` - Mendapatkan referensi API

### Content Management
- `POST /content/:content_type_id/entries` - Membuat entri
- `GET /content/:content_type_id/entries` - Daftar entri
- `GET /content/entries/:entry_id` - Mendapatkan entri
- `PUT /content/entries/:entry_id` - Memperbarui entri
- `DELETE /content/entries/:entry_id` - Menghapus entri
- `GET /content/entries/:entry_id/seo-preview` - Mendapatkan preview SEO

### Content Relations
- `POST /content/:from_content_id/relations` - Membuat relasi
- `GET /content/:from_content_id/relations` - Daftar relasi
- `DELETE /content/relations/:relation_id` - Menghapus relasi

### Media Library
- `POST /media/upload` - Upload media
- `POST /media/bulk-upload` - Bulk upload
- `GET /media` - Daftar media
- `GET /media/:id` - Mendapatkan media
- `PUT /media/:id` - Memperbarui media
- `DELETE /media/:id` - Menghapus media
- `POST /media/folders` - Membuat folder
- `GET /media/folders` - Daftar folder
- `GET /media/search` - Pencarian media

### Workflow Management
- `POST /workflow/entries/:entry_id/status` - Mengubah status
- `POST /workflow/entries/:entry_id/request-review` - Request review
- `POST /workflow/entries/:entry_id/approve` - Menyetujui entri
- `POST /workflow/entries/:entry_id/reject` - Menolak entri
- `POST /workflow/entries/:entry_id/publish` - Memublikasikan entri
- `GET /workflow/entries/:entry_id/history` - Mendapatkan history
- `POST /workflow/entries/:entry_id/comments` - Menambah komentar
- `GET /workflow/entries/:entry_id/comments` - Mendapatkan komentar
- `POST /workflow/entries/:entry_id/assign` - Assign entri
- `GET /workflow/assignments` - Mendapatkan assignments
- `GET /workflow/content-types/:id/entries` - Mendapatkan entri berdasarkan status
- `GET /workflow/content-types/:id/stats` - Mendapatkan statistik workflow

### User Management
- `POST /users` - Membuat user
- `GET /users` - Daftar users
- `GET /users/:id` - Mendapatkan user
- `PUT /users/:id` - Memperbarui user
- `DELETE /users/:id` - Menghapus user

### Role & Permissions
- `POST /roles` - Membuat role
- `GET /roles` - Daftar roles
- `GET /roles/:id` - Mendapatkan role
- `PUT /roles/:id` - Memperbarui role
- `DELETE /roles/:id` - Menghapus role
- `POST /roles/:id/duplicate` - Duplikasi role
- `POST /roles/assign` - Assign role ke user

### Search
- `GET /search/entries` - Pencarian full-text
- `POST /search/advanced` - Pencarian advanced
- `GET /search/facets` - Mendapatkan search facets
- `GET /search/autocomplete` - Mendapatkan saran autocomplete
- `GET /search/entries/:entry_id/related` - Mendapatkan entri terkait
- `POST /search/bulk` - Bulk search
- `GET /search/stats` - Mendapatkan statistik pencarian

---

## Matriks Permission

### Permission Berbasis Role

#### Admin Role
- **Semua Modul**: Akses penuh (create, read, update, delete, approve)
- **Content Entry**: Create, Read, Update (semua field), Delete, Approve
- **Media**: Create, Read, Update, Delete
- **SEO**: Create, Read, Update, Delete (semua field)
- **Workflow**: Semua transisi status
- **User Management**: Akses penuh
- **Role & Permissions**: Akses penuh

#### Editor Role
- **Content Entry**: Create, Read, Update (semua field)
- **Media**: Create, Read, Update
- **SEO**: Read (semua field)
- **Workflow**: Dapat mengubah status dari draft → in_review → ready_for_approval

#### Manager Role
- **Content Entry**: Read (semua field), Approve
- **Media**: Read
- **SEO**: Read (semua field)
- **Workflow**: Dapat approve, reject, publish entri

#### Viewer Role
- **Content Entry**: Read (semua field)
- **Media**: Read
- **SEO**: Read (semua field)
- **Workflow**: Hanya melihat, tidak ada perubahan status

#### SEO Specialist Role
- **Content Entry**: Read (semua field), Update (hanya field SEO)
- **Media**: Read
- **SEO**: Create, Read, Update (semua field)
- **Workflow**: Hanya melihat, tidak ada perubahan status

#### Content Writer Role
- **Content Entry**: Create, Read, Update (hanya field non-SEO)
- **Media**: Create, Read
- **SEO**: Tidak ada akses
- **Workflow**: Dapat mengubah status dari draft → in_review → ready_for_approval

---

## Aturan Transisi Status

### Transisi yang Valid

| Dari Status | Ke Status | Role Diperlukan |
|------------|-----------|-----------------|
| draft | in_review | editor, admin |
| in_review | ready_for_approval | editor, admin |
| in_review | rejected | editor, admin |
| in_review | draft | editor, admin |
| ready_for_approval | approved | manager, admin |
| ready_for_approval | rejected | manager, admin |
| approved | published | manager, admin |
| rejected | draft | editor, admin |

### Pembatasan Transisi
- Transisi status divalidasi terhadap role pengguna
- Transisi yang tidak valid ditolak dengan pesan error
- Semua transisi dicatat di WorkflowHistory

---

## Penanganan Error

### Skenario Error Umum

1. **Error Validasi**
   - Validasi field gagal
   - Pesan error ditampilkan ke pengguna
   - Field yang tidak valid disorot

2. **Error Permission**
   - Pengguna tidak memiliki permission yang diperlukan
   - Tindakan diblokir
   - Pesan error menjelaskan permission yang hilang

3. **Error Transisi Status**
   - Transisi status tidak valid
   - Transisi diblokir
   - Pesan error menampilkan transisi yang valid

4. **Error Not Found**
   - Resource tidak ditemukan
   - Error 404 ditampilkan
   - Pengguna diarahkan ke halaman yang sesuai

5. **Error Duplikat**
   - Pelanggaran constraint unik
   - Pesan error ditampilkan
   - Pengguna diminta mengubah nilai

---

## Catatan

- Semua timestamp disimpan dalam UTC dan ditampilkan dalam timezone lokal pengguna
- Soft delete digunakan untuk content types, entries, users, dan roles
- Semua tindakan dicatat untuk tujuan audit
- Upload file divalidasi untuk tipe dan ukuran
- Password hashing menggunakan bcrypt dengan faktor biaya yang sesuai
- Response API mengikuti struktur JSON yang konsisten
- Pesan error ramah pengguna dan dapat ditindaklanjuti

---

## Kesimpulan

Dokumentasi ini memberikan gambaran komprehensif tentang semua alur kerja dalam platform CMS. Setiap fitur dirancang untuk bekerja secara independen sambil mengintegrasikan dengan mulus dengan fitur lain untuk menyediakan solusi manajemen konten yang lengkap.

Untuk dokumentasi API spesifik, lihat:
- `backend/REST_API.md` - Dokumentasi REST API
- `backend/GRAPHQL_API.md` - Dokumentasi GraphQL API

Untuk dokumentasi komponen frontend, lihat:
- File komponen di `frontend/components/`
- File halaman di `frontend/app/`

