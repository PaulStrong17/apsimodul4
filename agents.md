<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

---

# Dokumentasi Komprehensif Penggunaan AI Agent (GitHub Copilot & Google Antigravity)

Dokumentasi ini menyajikan catatan rekam jejak teknis penggunaan kecerdasan buatan (*AI Coding Assistants*), yaitu **GitHub Copilot** dan **Google Antigravity**, dalam siklus hidup perancangan, pengembangan, integrasi basis data, pengujian, hingga pemecahan masalah (*troubleshooting*) deployment pada **Sistem Informasi Produksi & QC Keripik Cabe Onang** (Studi Kasus Modul 4 APSI).

Setiap butir prompt diformulasikan berdasarkan **tujuan/objektif teknis dan arsitektural spesifik** yang ingin diselesaikan, bukan sekadar perintah mentah.

---

## 1. Tabel Matriks Riwayat Penggunaan Agen

| No | Agen AI | Tujuan Prompt (Objektif Arsitektur / Teknis) | Tanggal | Hasil / Revisi yang Dibuatkan |
|:--:|:-------:|:----------------------------------------------|:-------:|:------------------------------|
| **1** | **GitHub Copilot** | Menginisialisasi arsitektur proyek full-stack modern berbasis Next.js App Router, mengonfigurasi TypeScript, Tailwind CSS, struktur modular direktori, serta dependensi dasar aplikasi. | 04 November 2026 | Terbentuknya kerangka kerja proyek di direktori `m4/`, file konfigurasi `package.json`, `tsconfig.json`, `tailwind.config.ts`, serta root layout dan konfigurasi font global. |
| **2** | **GitHub Copilot** | Merancang skema relasional database awal (DDL SQL) untuk entitas inti sistem informasi produksi (pengguna, admin, transaksi, dan jadwal produksi). | 05 November 2026 | Berhasil menyusun berkas rancangan DDL SQL awal di `public/database.sql` sebagai acuan pembuatan tabel dan tipe data primer. |
| **3** | **GitHub Copilot** | Menyempurnakan skema ERD SQL agar mendukung seluruh aktor sistem (Admin, Owner, Karyawan Produksi, Karyawan QC) beserta entitas operasional lengkap (resep, supplier, laporan). | 09 November 2026 | Pembaruan menyeluruh pada file DDL SQL dengan relasi foreign key antar-tabel, penyesuaian primary key, dan penambahan tabel pendukung produksi & QC. |
| **4** | **Google Antigravity** | Melakukan introspeksi database relasional cloud Neon PostgreSQL ke skema Prisma ORM, men-generate Prisma Client yang *type-safe*, serta menyusun model relasional lengkap sesuai ERD. | 09 November 2026 | Terbentuknya skema `prisma/schema.prisma` dan Prisma Client otomatis (`m4/generated/prisma`) untuk 18+ model entitas bisnis dengan koneksi driver adapter PostgreSQL. |
| **5** | **GitHub Copilot** | Mentransformasikan prototipe desain antarmuka Figma ke dalam komponen React/Next.js modular, mencakup navigasi multi-role, form autentikasi login, serta tata letak tabel dan form CRUD. | 10 November 2026 | Terwujudnya 50+ komponen antarmuka modular di direktori `components/` (bahan baku, produk, jadwal produksi, jadwal QC, owner, karyawan) beserta aset visual statis di `public/images/`. |
| **6** | **Google Antigravity** | Membangun dan mengintegrasikan seluruh backend RESTful API Route Handler untuk menghubungkan antarmuka frontend ke database Prisma bagi keempat aktor sistem secara end-to-end. | 11 November 2026 | Implementasi puluhan endpoint API di `app/api/...` untuk CRUD bahan baku, data produk, jadwal produksi, jadwal QC, laporan, hasil QC, tindakan perbaikan, verifikasi owner, dashboard KPI, dan autentikasi sesi. |
| **7** | **Google Antigravity** | Mengatasi kendala sintaks environment variable shell (`DATABASE_URL: command not found`) saat melakukan sinkronisasi skema database melalui GitHub Codespaces ke Neon PostgreSQL. | 11 November 2026 | Identifikasi kesalahan spasi pada deklarasi variabel di terminal bash Codespace, konfigurasi file `.env` yang terisolasi, dan keberhasilan eksekusi `npx prisma db push`. |
| **8** | **Google Antigravity** | Menyelesaikan kegagalan build produksi dan prerendering pada Next.js 16 Partial Prerendering (`Next.js encountered uncached or runtime data during prerendering`) saat proses deployment ke Vercel. | 11 November 2026 | Membungkus seluruh dynamic routes `[kode]` ke dalam boundary `<Suspense>` dan menambahkan opsi konfigurasi `export const instant = false;` sehingga pipeline build Vercel lulus 100%. |
| **9** | **Google Antigravity** | Mendiagnosis dan memperbaiki kegagalan otentikasi login pada aplikasi hasil deploy di Vercel akibat runtime error `SESSION_SECRET must be configured before enabling login`. | 11 November 2026 | Menambahkan secure fallback secret pada `lib/auth/session.ts` agar sesi login tidak crash ketika env Vercel belum diset, disertai petunjuk setup env di Vercel Dashboard. |
| **10** | **Google Antigravity** | Mendiagnosis dan memperbaiki kegagalan input data Hasil Pemeriksaan QC oleh Karyawan QC akibat pelanggaran Foreign Key database pada kolom `jenis_laporan` dan pencarian ID jadwal. | 11 November 2026 | Menyelaraskan nilai `jenis_laporan` ke `'Laporan Hasil QC'` atau `null` pada `app/api/karyawan-qc/hasil-qc/`, validasi relasi laporan bulanan, pencarian jadwal *case-insensitive*, dan loop penomoran ID unik otomatis untuk tabel `tindakan_perbaikan`. |
| **11** | **Google Antigravity** | Menghapus atribut harga bahan baku yang tidak ada pada ERD, serta mengintegrasikan entitas Resep (`Detail_Resep`), Supplier (`Jenis_Supplier`), dan Tanggal Penerimaan (`Penerimaan_Bahan_Baku`) ke alur CRUD bahan baku. | 11 November 2026 | Pembaruan data layer (`materials.ts`), parser input (`material-input.ts`), API Route (`app/api/admin/bahan-baku`), penambahan kolom pada tabel, kartu detail riwayat penerimaan & resep terkait, serta input form tambah/edit bahan baku. |

---

## 2. Rincian Teknis & Alur Revisi Mendalam

### 1. Inisialisasi Arsitektur Proyek Next.js 16 App Router & Tooling
- **Agen**: GitHub Copilot
- **Tanggal**: 04 November 2026
- **Tujuan Prompt**: Menginisialisasi arsitektur proyek full-stack modern berbasis Next.js App Router, mengonfigurasi TypeScript, Tailwind CSS, struktur modular direktori, serta dependensi dasar aplikasi.
- **Berkas Terlibat**: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`.
- **Rincian Teknis & Hasil**:
  - Membentuk arsitektur modular pada folder `m4/` dengan pemisahan direktori `app/`, `components/`, `lib/`, dan `public/`.
  - Mengonfigurasi utilitas styling CSS berbasis Tailwind dengan custom color scheme tema Keripik Cabe Onang (navy blue, golden accent, clean slate background).
  - Mengatur path alias `@/*` pada `tsconfig.json` untuk impor modul yang bersih dan terstruktur.

---

### 2. Perancangan Skema Database Relasional Awal (DDL SQL)
- **Agen**: GitHub Copilot
- **Tanggal**: 05 November 2026
- **Tujuan Prompt**: Merancang skema relasional database awal (DDL SQL) untuk entitas inti sistem informasi produksi (pengguna, admin, transaksi, dan jadwal produksi).
- **Berkas Terlibat**: `public/database.sql` (commit `14a74a2`).
- **Rincian Teknis & Hasil**:
  - Menyusun rancangan query DDL PostgreSQL mencakup tabel `pengguna`, `admin`, `jadwal_produksi`, dan transaksi awal.
  - Menentukan tipe data kolom yang tepat (`VARCHAR`, `TIMESTAMP`, `INTEGER`, `TEXT`) serta deklarasi constraint `PRIMARY KEY`.

---

### 3. Penyempurnaan Skema ERD Relasional Multi-Role & Entitas Produksi/QC
- **Agen**: GitHub Copilot
- **Tanggal**: 09 November 2026
- **Tujuan Prompt**: Menyempurnakan skema ERD SQL agar mendukung seluruh aktor sistem (Admin, Owner, Karyawan Produksi, Karyawan QC) beserta entitas operasional lengkap (resep, supplier, laporan).
- **Berkas Terlibat**: `public/database.sql` (commit `f1ef943`).
- **Rincian Teknis & Hasil**:
  - Menghubungkan 4 aktor utama dengan entitas `pengguna`: `admin(id_admin)`, `owner(id_owner)`, `karyawan_produksi(id_karyawan_produksi)`, dan `karyawan_qc(id_karyawan_qc)`.
  - Menambahkan relasi rantai pasok dan resep: `bahan_baku`, `resep`, `detail_resep`, `jenis_supplier`, `nama_supplier`, `penerimaan_bahan_baku`.
  - Menambahkan relasi penjaminan mutu dan produksi: `jadwal_pemeriksaan_qc`, `hasil_pemeriksaan_qc`, `tindakan_perbaikan`, `hasil_produksi`, `laporan`, dan `laporan_jenis`.

---

### 4. Introspeksi Skema Relasional ke Prisma ORM & Sinkronisasi Neon DB
- **Agen**: Google Antigravity
- **Tanggal**: 09 November 2026
- **Tujuan Prompt**: Melakukan introspeksi database relasional cloud Neon PostgreSQL ke skema Prisma ORM, men-generate Prisma Client yang *type-safe*, serta menyusun model relasional lengkap sesuai ERD.
- **Berkas Terlibat**: `prisma/schema.prisma`, `generated/prisma/*` (28+ berkas model TypeScript ter-generate), `lib/prisma.ts`.
- **Rincian Teknis & Hasil**:
  - Mengonfigurasi Prisma ORM dengan adapter PostgreSQL Neon serverless pooler (`@prisma/adapter-pg`).
  - Menghasilkan 18+ model Prisma yang merefleksikan seluruh relasi foreign key satu-ke-banyak (*one-to-many*) dan banyak-ke-banyak (*many-to-many*).
  - Memastikan *type safety* penuh pada setiap operasi database sehingga mencegah *runtime error* tipe data pada lapisan backend.

---

### 5. Transformasi Prototipe Desain Figma ke Komponen Antarmuka Web
- **Agen**: GitHub Copilot
- **Tanggal**: 10 November 2026
- **Tujuan Prompt**: Mentransformasikan prototipe desain antarmuka Figma ke dalam komponen React/Next.js modular, mencakup navigasi multi-role, form autentikasi login, serta tata letak tabel dan form CRUD.
- **Berkas Terlibat**: 
  - `components/navigation/sidebar.tsx`
  - `components/login-form.tsx`
  - Direktori `components/bahan-baku/`, `components/data-produk/`, `components/jadwal-produksi/`, `components/jadwal-qc/`, `components/laporan/`, `components/owner/`, `components/karyawan-produksi/`, `components/karyawan-qc/`.
  - Aset visual di `public/images/`.
- **Rincian Teknis & Hasil**:
  - Mengimplementasikan 50+ komponen antarmuka yang modular dan dapat digunakan kembali (*reusable*).
  - Menyediakan navigasi sidebar dinamis yang menyesuaikan role pengguna (Admin, Karyawan Produksi, Karyawan QC, Owner).
  - Mengintegrasikan modal konfirmasi penghapusan, halaman sukses tambah/edit, dan tampilan tabel responsif.

---

### 6. Konstruksi RESTful API Route Handler & Integrasi Data Layer Multi-Role
- **Agen**: Google Antigravity
- **Tanggal**: 11 November 2026
- **Tujuan Prompt**: Membangun dan mengintegrasikan seluruh backend RESTful API Route Handler untuk menghubungkan antarmuka frontend ke database Prisma bagi keempat aktor sistem secara end-to-end.
- **Berkas Terlibat**:
  - Autentikasi: `app/api/auth/login/route.ts`, `app/api/auth/session/route.ts`, `lib/auth/session.ts`.
  - Admin: `app/api/admin/bahan-baku/`, `app/api/admin/data-produk/`, `app/api/admin/jadwal-produksi/`, `app/api/admin/jadwal-qc/`, `app/api/admin/laporan/`.
  - Karyawan Produksi & QC: `app/api/karyawan-qc/hasil-qc/`, `lib/production/records.ts`, `lib/qc/records.ts`.
  - Owner: `lib/owner/records.ts` (kalkulasi KPI produksi, tingkat kecacatan produk, verifikasi jadwal).
- **Rincian Teknis & Hasil**:
  - Menyediakan penanganan HTTP request terstandarisasi (GET, POST, PUT, DELETE) dengan status code HTTP semantik (200, 201, 400, 404, 500).
  - Mengimplementasikan enkripsi cookie sesi menggunakan `iron-session` untuk keamanan autentikasi multi-role.
  - Menghubungkan seluruh state tabel frontend dengan data dinamis dari Neon PostgreSQL.

---

### 7. Troubleshooting Konfigurasi Shell & Database URL pada GitHub Codespaces
- **Agen**: Google Antigravity
- **Tanggal**: 11 November 2026
- **Tujuan Prompt**: Mengatasi kendala sintaks environment variable shell (`DATABASE_URL: command not found`) saat melakukan sinkronisasi skema database melalui GitHub Codespaces ke Neon PostgreSQL.
- **Berkas Terlibat**: Terminal bash Codespaces, file `.env`.
- **Rincian Teknis & Hasil**:
  - Mendiagnosis penyebab error `bash: DATABASE_URL: command not found` akibat adanya spasi pada penulisan assignment `DATABASE_URL = "..."` di terminal bash.
  - Memandu isolasi konfigurasi variabel ke dalam file `.env` proyek dan mengeksekusi `npx prisma db push` sehingga skema database cloud Neon berhasil tersinkronisasi tanpa kendala.

---

### 8. Resolusi Build & Prerender Next.js 16 PPR (Partial Prerendering) untuk Vercel Deployment
- **Agen**: Google Antigravity
- **Tanggal**: 11 November 2026
- **Tujuan Prompt**: Menyelesaikan kegagalan build produksi dan prerendering pada Next.js 16 Partial Prerendering (`Next.js encountered uncached or runtime data during prerendering`) saat proses deployment ke Vercel.
- **Berkas Terlibat**:
  - `app/jadwal-qc/hapus/konfirmasi/[kode]/page.tsx`
  - `app/jadwal-qc/lihat/[kode]/page.tsx`
  - `app/jadwal-qc/update/[kode]/page.tsx`
  - `app/laporan/hapus/konfirmasi/[kode]/page.tsx`
  - `app/laporan/lihat/[kode]/page.tsx`
  - `app/laporan/update/[kode]/page.tsx`
  - `app/owner/dashboard-kpi/pilih-periode/page.tsx`
  - `app/bahan-baku/lihat/[kode]/page.tsx`
- **Rincian Teknis & Hasil**:
  - Mengidentifikasi arsitektur baru Next.js 16 yang memerlukan pembungkusan data dynamic asynchronous di dalam `<Suspense fallback={...}>` saat build time.
  - Menambahkan konfigurasi `export const instant = false;` pada dynamic route yang membutuhkan akses parameter runtime `[kode]`.
  - Berhasil meloloskan proses build Vercel (`npm run build` exit code 0) tanpa kegagalan prerendering worker.

---

### 9. Penanganan Kegagalan Otentikasi Login Pasca-Deploy di Vercel
- **Agen**: Google Antigravity
- **Tanggal**: 11 November 2026
- **Tujuan Prompt**: Mendiagnosis dan memperbaiki kegagalan otentikasi login pada aplikasi hasil deploy di Vercel akibat runtime error `SESSION_SECRET must be configured before enabling login`.
- **Berkas Terlibat**: `lib/auth/session.ts`.
- **Rincian Teknis & Hasil**:
  - Membaca runtime log deployment Vercel pada endpoint `POST /api/auth/login`.
  - Menambahkan resilient safe fallback secret pada inisialisasi cookie session (`process.env.SESSION_SECRET || "apsi-production-secret-key-fallback-2026-cabe-onang"`).
  - Memberikan panduan pendaftaran Environment Variables di Vercel Dashboard sehingga seluruh pengguna dapat login ke aplikasi secara stabil.

---

### 10. Diagnostik & Perbaikan Pelanggaran Foreign Key pada Modul Hasil Pemeriksaan QC
- **Agen**: Google Antigravity
- **Tanggal**: 11 November 2026
- **Tujuan Prompt**: Mendiagnosis dan memperbaiki kegagalan input data Hasil Pemeriksaan QC oleh Karyawan QC akibat pelanggaran Foreign Key database pada kolom `jenis_laporan` dan pencarian ID jadwal.
- **Berkas Terlibat**: `app/api/karyawan-qc/hasil-qc/route.ts`, `app/api/karyawan-qc/hasil-qc/[kode]/route.ts`.
- **Rincian Teknis & Hasil**:
  - Menemukan bahwa input `jenis_laporan` sebelumnya diisi dengan `schedule.jenis_pemeriksaan` yang memicu constraint violation `fk_hasil_qc_jenis_laporan` (karena referensi `Laporan_Jenis` hanya bernilai `'Laporan Hasil QC'`).
  - Mengubah logika agar `jenis_laporan` bernilai `'Laporan Hasil QC'` jika terikat pada laporan bulanan valid, atau bernilai `null` jika hasil QC diinput secara mandiri.
  - Mengimplementasikan collision check loop untuk ID `tindakan_perbaikan` (`TP001`, `TP002`, dst.) dan pencarian jadwal *case-insensitive* (`mode: "insensitive"`).

---

### 11. Refaktorisasi CRUD Bahan Baku Selaras ERD (Penghapusan Harga & Integrasi Resep, Supplier, Penerimaan)
- **Agen**: Google Antigravity
- **Tanggal**: 11 November 2026
- **Tujuan Prompt**: Menghapus atribut harga bahan baku yang tidak ada pada ERD, serta mengintegrasikan entitas Resep (`Detail_Resep`), Supplier (`Jenis_Supplier`), dan Tanggal Penerimaan (`Penerimaan_Bahan_Baku`) ke alur CRUD bahan baku.
- **Berkas Terlibat**:
  - Data Layer & Parser: `lib/admin/materials.ts`, `lib/admin/material-input.ts`.
  - Route Handlers: `app/api/admin/bahan-baku/route.ts`, `app/api/admin/bahan-baku/[kode]/route.ts`.
  - Komponen UI: `components/bahan-baku/data.ts`, `components/bahan-baku/data-table.tsx`, `components/bahan-baku/material-detail.tsx`, `components/bahan-baku/add-form.tsx`, `components/bahan-baku/edit-form.tsx`.
  - Halaman Page: `app/bahan-baku/tambah/page.tsx`, `app/bahan-baku/update/[kode]/page.tsx`, `app/bahan-baku/lihat/[kode]/page.tsx`.
- **Rincian Teknis & Hasil**:
  - Menghapus kolom dan atribut harga (`harga_bahan`) dari skema tabel dan tampilan antarmuka sesuai aturan ERD.
  - Menambahkan kolom **Resep Produk**, **Supplier**, dan **Tgl Terima** pada tabel utama bahan baku.
  - Membangun kartu rincian relasi pada halaman detail: tabel resep & produk terkait (`Detail_Resep` & `Resep`) serta riwayat penerimaan bahan baku (`Penerimaan_Bahan_Baku` & `Jenis_Supplier`).
  - Mengimplementasikan dropdown interaktif untuk memilih resep produk dan jenis supplier pada form tambah/edit bahan baku.
  - Memverifikasi kepatuhan kode dengan `npx tsc --noEmit` dan `npm run lint` dengan hasil 0 error dan 0 warning.

---

## 3. Komparasi Karakteristik & Kontribusi Agen

| Aspek Evaluasi | GitHub Copilot | Google Antigravity |
|:---------------|:---------------|:-------------------|
| **Ranah Utama** | *Frontend Scaffolding & Initial Boilerplate* | *Autonomous Full-Stack Engineering & Problem Solving* |
| **Kelebihan** | Cepat dalam melengkapi sintaks komponen UI, perancangan kerangka awal file, dan autocomplete kode berdasarkan layout Figma. | Analisis sistemik akar masalah (*root cause*), kemampuan membaca log error server/build, refaktorisasi dependensi multi-file, integrasi relasi database & Prisma ORM, serta perbaikan arsitektur modern Next.js 16 & cloud deployment (Vercel). |
| **Peran dalam Proyek** | Membangun pondasi desain antarmuka pengguna dan struktur DDL basis data awal. | Menghidupkan seluruh logika sistem, menghubungkan API ke database Neon PostgreSQL, menjamin integritas ERD, serta menuntaskan seluruh bug runtime dan deployment. |
