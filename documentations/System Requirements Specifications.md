# 📄 System Requirements Specification (SRS)

**Nama Proyek:** Coding Study  
**Versi Dokumen:** 1.3.0 (Updated with Frontend & Tech Stack specifics)  
**Tanggal:** July 2026

---

## 1. Pendahuluan (Introduction)

### 1.1 Tujuan (Purpose)

Dokumen System Requirements Specification (SRS) ini merinci kebutuhan fungsional dan non-fungsional untuk **Coding Study**. Platform ini dirancang untuk menyediakan lingkungan belajar yang interaktif dan fleksibel bagi pengguna, memungkinkan mereka untuk mengakses materi pembelajaran pemrograman dan teknologi kapan saja dan di mana saja.

### 1.2 Target Pembaca (Intended Audience)

Dokumen ini ditujukan untuk digunakan oleh:

- **Tim Developer:** Sebagai panduan dalam implementasi teknis (Frontend, Backend, dan Database) serta arsitektur sistem.
- **Stakeholder & Product Owner:** Untuk memastikan bahwa kebutuhan bisnis dan ruang lingkup proyek MVP sejalan dengan ekspektasi mereka.
- **Quality Assurance (QA):** Sebagai dasar untuk menentukan kriteria penerimaan (acceptance criteria) dan skenario pengujian fungsionalitas.

### 1.3 Ruang Lingkup Produk (Product Scope)

**Coding Study** adalah platform _e-learning_ yang menghubungkan praktisi atau ahli (Mentor) dengan pembelajar (Student). Fungsionalitas inti pada fase Minimum Viable Product (MVP) ini meliputi:

- Registrasi dan autentikasi berbasis email dan password.
- Pemulihan kata sandi (Forgot Password) berbasis OTP via Email.
- Onboarding pengguna untuk memilih kategori minat pembelajaran.
- Katalog kelas dengan fitur pencarian dan filter (berdasarkan kategori, mentor, harga, tingkat kesulitan, dll).
- Proses _checkout_ dan pembayaran digital yang terintegrasi (Payment Gateway).
- _Dashboard_ belajar siswa yang mendukung pemutaran video tertanam (_embedded video_).
- Portal Mentor untuk manajemen kelas dan modul pembelajaran.

**Target Utama:** Individu yang ingin mempelajari keterampilan _coding_ dan teknologi secara _on-demand_.

### 1.4 Definisi & Terminologi

- **Student:** Pengguna akhir yang mendaftar, membeli kelas, dan mengakses modul pembelajaran.
- **Mentor:** Kreator konten yang memiliki akses untuk membuat kelas, menyusun kurikulum, dan memantau performa penjualan kelasnya.
- **Admin:** Pengelola sistem yang bertugas menyetujui kelas baru, memoderasi pengguna, dan menangani komplain atau sengketa (_dispute_).
- **RBAC:** Role-Based Access Control, metode pembatasan akses berdasarkan peran pengguna.
- **OTP:** One-Time Password, kata sandi sekali pakai untuk keamanan tambahan.
- **JWT:** JSON Web Token, standar industri untuk mengamankan pertukaran data autentikasi.

---

## 2. Deskripsi Umum (Overall Description)

### 2.1 Perspektif Produk (Product Perspective)

Sistem **Coding Study** dibangun sebagai aplikasi berbasis RESTful API di sisi backend (Node.js/Express) dan dapat dikonsumsi oleh berbagai platform client (Web/Mobile). Aplikasi ini dipaketkan menggunakan container (Docker) untuk konsistensi lingkungan deployment.

### 2.2 Fungsi Produk (Product Functions)

Platform ini memfasilitasi alur kerja (workflow) utama berikut:

1. **Autentikasi Pengguna:** Pendaftaran, login, lupa kata sandi dengan OTP, dan manajemen sesi.
2. **Onboarding:** Personalisasi pengalaman belajar dengan mengumpulkan preferensi minat kategori.
3. **Eksplorasi Kelas:** Pencarian kelas berdasarkan _keyword_, kategori, dan pengurutan (_sorting_) harga.
4. **Pembelian & Checkout:** Proses transaksi satu pintu yang aman dengan konfirmasi akses seketika (_instant access_) pasca pembayaran.
5. **Pengalaman Belajar:** Antarmuka pemutar video yang melacak progres belajar.
6. **Manajemen Konten:** Formulir bagi Mentor untuk mengatur detail kelas, membuat modul, dan menautkan URL video.
7. **Sistem Ulasan (Review):** Penilaian berbasis bintang (1-5) dan ulasan teks yang hanya dapat diberikan oleh Student yang telah memiliki kelas.

### 2.3 Kelas dan Peran Pengguna (User Classes and Roles)

| Peran       | Hak Akses Utama                                                                                                                 |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Student** | Mengelola profil, mencari kelas, _checkout_ pembayaran, mengakses modul belajar, memberikan ulasan, melacak _progress_ belajar. |
| **Mentor**  | Dasbor metrik penjualan dasar, manajemen profil mentor, CRUD (Create, Read, Update, Delete) data kelas dan modul pembelajaran.  |
| **Admin**   | Dasbor operasional: Manajemen pengguna (suspend/ban), verifikasi _payout_ mentor, dan melihat laporan seluruh transaksi.        |

### 2.4 Lingkungan Operasi (Operating Environment)

- **Frontend:** Browser web modern yang mendukung ES6+. Menggunakan framework React/Next.js dengan _styling_ Tailwind CSS dan _state management_ seperti Zustand atau Redux.
- **Backend:** Environment Node.js dengan framework Express.js dan TypeScript. Dibungkus dalam Docker Container.
- **Database:** PostgreSQL diakses menggunakan Prisma ORM.

---

## 3. Fitur Sistem (System Features)

### 3.1 Autentikasi dan Manajemen Sesi

- **Deskripsi:** Modul untuk mengamankan akses aplikasi dan membedakan _role_.
- **Alur Utama Frontend:** Antarmuka Login, Register, dan Reset Password.
- **Alur Utama Backend:** Validasi kredensial, issue JWT/Refresh Token (disimpan di tabel `sessions`), verifikasi OTP, hashing bcrypt.

### 3.2 Role-Based Access Control (RBAC)

- **Deskripsi:** Memastikan setiap pengguna hanya dapat mengakses _resources_ yang menjadi haknya.
- **Implementasi Frontend:** _Protected Routes_ di sisi client, menyembunyikan navigasi atau tombol spesifik jika tidak sesuai role.
- **Implementasi Backend:** Penggunaan _guard middleware_ di rute Express untuk membatasi endpoint tertentu.

### 3.3 Email Sender

- **Deskripsi:** Layanan pengiriman notifikasi via email secara otomatis. (OTP Lupa Password, Invoice, Notifikasi).

### 3.4 Onboarding dan Minat Pengguna

- **Deskripsi:** Halaman pilihan visual (_pills/cards_) minat setelah registrasi pertama.
- **Alur Utama:** Student memilih UI kategori minat -> API `/api/onboarding/complete` menyimpan data ke `UserPreference`.

### 3.5 Katalog dan Pencarian Kelas (Discovery)

- **Deskripsi:** Halaman pencarian utama Frontend (berisi _Grid Cards_ kelas) dan _Sidebar filter_.
- **Fungsi Filter:** Search bar, Filter Kategori, Filter Harga, Sorting (Terbaru, Termurah, dsb).

### 3.6 Manajemen Kelas dan Modul (Mentor Dashboard)

- **Deskripsi:** Dasbor internal Mentor.
- **Fungsi UI:** Form pembuatan kelas, _drag-and-drop_ list modul pembelajaran, pengaturan _Thumbnail_ dan Video URL.

### 3.7 Sistem Transaksi (Checkout) _(To Be Implemented)_

- **Deskripsi:** Memfasilitasi pembelian kelas dengan integrasi UI Checkout (Ringkasan Pembayaran) dan modul API Payment Gateway (Webhook).

### 3.8 Dasbor Belajar (Learning Experience) _(To Be Implemented)_

- **Deskripsi:** Antarmuka "Kelas Saya" dengan _Video Player_ di tengah dan _Sidebar_ navigasi daftar materi kursus yang memuat indikator (centang) _Progress Bar_.

---

## 4. Kebutuhan Antarmuka Eksternal (External Interface Requirements)

### 4.1 Antarmuka Pengguna (UI/UX Frontend)

- Menggunakan pendekatan _Mobile-First Design_ agar responsif di seluruh layar gawai.
- **Komponen:** Penggunaan standard _Component Library_ (seperti shadcn/ui atau Chakra UI) untuk konsistensi desain form, modal, dan notifikasi (toast).
- **Integrasi API:** Penggunaan Axios/Fetch dengan interceptor otomatis untuk menangani status `401 Unauthorized` dan memperbarui sesi JWT di background.

### 4.2 Antarmuka Perangkat Lunak (APIs & Integrations)

- **RESTful API:** Semua endpoint mengembalikan respons terstandarisasi JSON.
- **OpenAPI/Swagger:** Terdokumentasi interaktif di `/api-docs`.
- **Mail Service:** Terintegrasi SMTP/SendGrid.

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 5.1 Keamanan Aplikasi (Security)

- **Data Sanitization & Validation:** `express-validator` di sisi BE, dan `react-hook-form` + `zod` di sisi FE.
- **Helmet:** Menerapkan _security headers_ dasar.

### 5.2 Logging dan Monitoring

- **Aplikasi:** Penggunaan middleware `morgan` untuk logging permintaan HTTP.

### 5.3 CI/CD dan Containerization

- **Docker Containerization:** Aplikasi (FE & BE) dibungkus _Docker Image_ (`Dockerfile`, `docker-compose`).
- **GitHub Workflow (CI/CD):** Pipeline _GitHub Actions_ mengeksekusi _Linting_, _Type Checking_, dan _Build_.

---

## 6. Kebutuhan Data (Data Requirements)

### 6.1 Model Data Logis (Logical Data Model)
Berdasarkan implementasi _Prisma Schema_, struktur database terbagi menjadi tabel-tabel utama sebagai berikut:

- **Tabel Terimplementasi (Saat Ini):**
  - `user`: (id, name, email, password, role_id, onboardingCompleted, timestamps).
  - `sessions`: (id, user_id, token_hash, revoked, timestamps).
  - `classes`: (id, mentor_id, category_id, judul, deskripsi, harga, thumbnail_url, status [DRAFT/PUBLISHED], timestamps).
  - `modules`: (id, classId, urutan, judul, deskripsi, videoUrl, timestamps).
  - `Category`: (id, name, description, timestamps).
  - `UserPreference`: (id, userId, categoryId, timestamps).

- **Tabel Terencana (Fase Berikutnya):**
  - `roles`: (id, name, description, timestamps).
  - `permissions`: (id, name, description, timestamps).
  - `role_permissions`: (role_id, permission_id).
  - `otp_requests` (Lupa Password): (id, email, otp_code, expires_at, is_used).
  - `Transactions`: (id, student_id, class_id, amount, status, payment_method, updated_at).
  - `User_Classes` (Kepemilikan Kelas): (student_id, class_id, progress_percentage).
  - `Reviews`: (id, class_id, student_id, rating, komentar).

### 6.2 Integritas Data
- Model basis data dipecah secara modular dalam file `.prisma` terpisah (contoh: `user.prisma`, `course.prisma`, `module.prisma`) dan digabung saat proses generasi (_Prisma schema splitting_).
- Menjaga relasi dan konstrain _Foreign Key_ dengan aturan `ON DELETE CASCADE` untuk data terkait langsung seperti `sessions` dan `UserPreference`, atau `RESTRICT/SET NULL` pada data transaksional/kategorikal.

---

## 7. Arsitektur Sistem (System Architecture)

- **Pola Arsitektur:** Client-Server Architecture via REST API.
- **Backend:** Express.js Layered Architecture, Prisma ORM PostgreSQL.
- **Frontend:** React/Next.js (App Router/Pages), TailwindCSS.

---

## 8. Peningkatan di Masa Depan (Post-MVP Roadmap)

- Implementasi integrasi Payment Gateway penuh.
- Fitur _Real-time Chat_ antar siswa dan mentor via WebSockets.
