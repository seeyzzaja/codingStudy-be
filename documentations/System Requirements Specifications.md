# 📄 System Requirements Specification (SRS)
**Nama Proyek:** Coding Study  
**Versi Dokumen:** 1.0.0  
**Tanggal:** April 2026  

---

## 1. Pendahuluan (Introduction)

### 1.1 Tujuan (Purpose)
Dokumen System Requirements Specification (SRS) ini merinci kebutuhan fungsional dan non-fungsional untuk **Coding Study**. Platform ini dirancang untuk menyediakan lingkungan belajar yang interaktif dan fleksibel bagi pengguna, memungkinkan mereka untuk mengakses materi pembelajaran pemrograman dan teknologi kapan saja dan di mana saja.

### 1.2 Target Pembaca (Intended Audience)
Dokumen ini ditujukan untuk digunakan oleh:
* **Tim Developer:** Sebagai panduan dalam implementasi teknis (Frontend, Backend, dan Database) serta arsitektur sistem.
* **Stakeholder & Product Owner:** Untuk memastikan bahwa kebutuhan bisnis dan ruang lingkup proyek MVP sejalan dengan ekspektasi mereka.
* **Quality Assurance (QA):** Sebagai dasar untuk menentukan kriteria penerimaan (acceptance criteria) dan skenario pengujian fungsionalitas.

### 1.3 Ruang Lingkup Produk (Product Scope)
**Coding Study** adalah platform *e-learning* yang menghubungkan praktisi atau ahli (Mentor) dengan pembelajar (Student). Fungsionalitas inti pada fase Minimum Viable Product (MVP) ini meliputi:
* Registrasi dan autentikasi berbasis email dan OAuth (Google/GitHub).
* Katalog kelas dengan fitur pencarian dan filter (berdasarkan bahasa pemrograman, tingkat kesulitan, dll).
* Proses *checkout* dan pembayaran digital yang terintegrasi (Payment Gateway).
* *Dashboard* belajar siswa yang mendukung pemutaran video tertanam (*embedded video*).
* Portal Mentor untuk manajemen kelas dasar (CRUD informasi kelas dan kurikulum).

**Target Utama:** Individu yang ingin mempelajari keterampilan *coding* dan teknologi secara *on-demand*.

### 1.4 Definisi & Terminologi
* **Student:** Pengguna akhir yang mendaftar, membeli kelas, dan mengakses modul pembelajaran.
* **Mentor:** Kreator konten yang memiliki akses untuk membuat kelas, menyusun kurikulum, dan memantau performa penjualan kelasnya.
* **Admin:** Pengelola sistem yang bertugas menyetujui kelas baru, memoderasi pengguna, dan menangani komplain atau sengketa (*dispute*).
* **Checkout:** Proses transaksional di mana Student melakukan pembelian akses ke sebuah kelas.
* **MVP:** Minimum Viable Product (Versi rilis dengan fitur fundamental yang siap digunakan pengguna awal).
* **JWT:** JSON Web Token, standar industri untuk mengamankan pertukaran data autentikasi.

---

## 2. Deskripsi Umum (Overall Description)

### 2.1 Perspektif Produk (Product Perspective)
Sistem **Coding Study** dibangun sebagai aplikasi web modern (Single Page Application/SSR) yang responsif dan dirancang dengan pendekatan *Mobile-First*. Untuk mempercepat peluncuran MVP, sistem ini akan menggunakan layanan pihak ketiga (*Managed Services*) untuk operasi yang kompleks:
* **Video Hosting:** YouTube (Unlisted) atau Vimeo untuk menghemat biaya *bandwidth* dan infrastruktur streaming.
* **Payment Gateway:** Midtrans atau Xendit untuk memproses transaksi bank transfer, *e-wallet*, dan *Virtual Account* secara otomatis.
* **Asset Storage:** Cloudinary atau AWS S3 untuk penyimpanan aset statis (foto profil, *thumbnail* kelas, modul PDF).
* **Authentication:** NextAuth.js / Supabase Auth / implementasi JWT manual.

### 2.2 Fungsi Produk (Product Functions)
Platform ini memfasilitasi alur kerja (workflow) utama berikut:
1. **Autentikasi Pengguna:** Pendaftaran, login, pemulihan kata sandi (*forgot password*), dan manajemen sesi menggunakan JWT.
2. **Eksplorasi Kelas:** Pencarian kelas berdasarkan *keyword*, kategori, dan pengurutan (*sorting*) harga/rating.
3. **Pembelian & Checkout:** Proses transaksi satu pintu yang aman dengan konfirmasi akses seketika (*instant access*) pasca pembayaran.
4. **Pengalaman Belajar:** Antarmuka pemutar video yang melacak progres belajar (*completed/uncompleted modules*).
5. **Manajemen Konten:** Formulir bagi Mentor untuk mengatur detail kelas, membuat silabus/modul, dan menautkan URL video.
6. **Sistem Ulasan (Review):** Penilaian berbasis bintang (1-5) dan ulasan teks yang hanya dapat diberikan oleh Student yang telah memiliki kelas.

### 2.3 Kelas dan Peran Pengguna (User Classes and Roles)

| Peran | Hak Akses Utama |
| :--- | :--- |
| **Student** | Mengelola profil, mencari kelas, *checkout* pembayaran, mengakses modul belajar, memberikan ulasan, melacak *progress* belajar. |
| **Mentor** | Dasbor metrik penjualan dasar, manajemen profil mentor, CRUD (Create, Read, Update, Delete) data kelas dan modul pembelajaran. |
| **Admin** | Dasbor operasional: Manajemen pengguna (suspend/ban), verifikasi *payout* mentor, dan melihat laporan seluruh transaksi. |

### 2.4 Lingkungan Operasi (Operating Environment)
* **Frontend:** Browser web modern yang mendukung ES6+ (Chrome, Safari, Firefox, Edge). Dioptimalkan untuk resolusi mulai dari 360px (Mobile) hingga 1920px (Desktop).
* **Backend:** Environment Node.js (v18/v20) pada sistem operasi berbasis Linux (Ubuntu/Alpine).
* **Database:** PostgreSQL versi 14 atau lebih baru.

### 2.5 Batasan Desain & Implementasi (Constraints)
* **Tenggat Waktu:** ~3 bulan untuk rilis MVP.
* **Arsitektur:** Menggunakan arsitektur *Monolithic* (Backend tunggal) untuk menekan kompleksitas awal, dengan potensi pemisahan *microservices* di masa depan. *Frontend* dipisah (*decoupled*) dari *Backend* (RESTful API).
* **Efisiensi Biaya:** Memanfaatkan infrastruktur *Cloud Serverless* (Vercel/Netlify) untuk *Frontend* dan layanan PaaS (Railway/Render) atau VPS dasar untuk *Backend* dan Database.

### 2.6 Asumsi dan Ketergantungan (Assumptions and Dependencies)
* Ekosistem Node.js/TypeScript digunakan di seluruh *stack* untuk memudahkan pertukaran data (*Fullstack TypeScript*).
* Keandalan platform sangat bergantung pada *uptime* API pihak ketiga (Payment Gateway, Video Hosting).

---

## 3. Fitur Sistem (System Features)

### 3.1 Autentikasi dan Manajemen Sesi
* **Deskripsi:** Modul untuk mengamankan akses aplikasi dan membedakan *role* (Student/Mentor/Admin).
* **Alur Utama:**
  1. Pengguna memasukkan kredensial email/password atau login via OAuth (Google).
  2. *Backend* memvalidasi dan mengembalikan JWT (Access Token & Refresh Token) ke *Frontend*.
  3. *Frontend* menyimpan token secara aman (misalnya via `httpOnly cookies` atau *in-memory*).
* **Keamanan:** Menerapkan proses *hashing* (bcrypt/Argon2) untuk penyimpanan kata sandi.

### 3.2 Katalog dan Pencarian Kelas
* **Deskripsi:** Halaman *discovery* untuk menampilkan daftar kelas.
* **Alur Utama:**
  1. *Frontend* meminta data kelas melalui REST API secara *paginated* (misalnya 12 item per halaman).
  2. Pengguna menerapkan filter (misal: "Web Development", "Pemula", "Gratis/Berbayar").
  3. *Backend* melakukan *query filtering* pada database PostgreSQL dan mengembalikan *response* berformat JSON.

### 3.3 Sistem Transaksi (Checkout)
* **Deskripsi:** Memfasilitasi perolehan (pembelian) kelas.
* **Alur Utama:**
  1. Student menekan tombol "Beli Kelas", sistem membuat rekam jejak pesanan (*order/invoice*) berstatus `PENDING` di database.
  2. Sistem memanggil API Xendit/Midtrans untuk membuat halaman pembayaran (*Payment Link/Invoice*).
  3. Setelah Student membayar, *Payment Gateway* mengirimkan *Webhook Callback* ke *Backend* **Coding Study**.
  4. *Backend* memvalidasi *signature callback*, mengubah status menjadi `PAID`, dan memberikan akses kelas kepada Student secara otomatis.

### 3.4 Dasbor Belajar (Learning Experience)
* **Prasyarat:** Akses kelas harus berstatus kepemilikan valid.
* **Alur Utama:**
  1. Student memilih materi dari daftar silabus/modul di *sidebar*.
  2. Halaman menampilkan pemutar video (YouTube Iframe API / React Player).
  3. Student dapat menekan tombol "Selesai" pada modul untuk memperbarui *progress bar* belajar (disimpan di database).

### 3.5 Manajemen Kelas (Mentor Dashboard)
* **Deskripsi:** Modul CMS (Content Management System) internal bagi Mentor.
* **Alur Utama:**
  1. Mentor membuat *draft* kelas baru (Judul, Harga, Deskripsi, Thumbnail). Thumbnail diunggah ke Cloudinary/S3.
  2. Mentor menyusun modul dan menambahkan tautan video YouTube (*Unlisted*).
  3. Setelah selesai, Mentor mengubah status kelas menjadi `PUBLISHED` agar muncul di katalog publik.

---

## 4. Kebutuhan Antarmuka Eksternal (External Interface Requirements)

### 4.1 Antarmuka Pengguna (UI/UX)
* **Desain:** Dibangun menggunakan *component library* modern (Tailwind CSS / Material UI / Chakra UI) untuk konsistensi dan kecepatan *development*.
* **Responsivitas:** Wajib mendukung tampilan *Mobile* (320px - 480px), *Tablet* (768px - 1024px), dan *Desktop* (1024px+).

### 4.2 Antarmuka Perangkat Lunak (APIs & Integrations)
* **RESTful API:** *Backend* akan mengekspos API dengan respons berformat JSON. Dokumentasi API akan menggunakan **Swagger/OpenAPI**.
* **Storage Provider:** Integrasi SDK Cloudinary atau AWS S3 via *Backend* untuk mengamankan proses unggah gambar (*presigned URLs* atau validasi *server-side*).

### 4.3 Antarmuka Komunikasi
* **Protokol:** Seluruh komunikasi *Client-Server* dan *Server-to-Server* (Webhook) harus melalui **HTTPS (TLS 1.2+)**.
* **CORS (Cross-Origin Resource Sharing):** *Backend* hanya akan menerima *request* dari *domain Frontend* yang telah didaftarkan (*whitelisted*).

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 5.1 Performa (Performance)
* **Waktu Muat (Page Load):** *First Contentful Paint* (FCP) halaman utama harus `< 1.5 detik` pada koneksi 4G standar.
* **Response Time API:** Target rata-rata respons *Backend* untuk operasi *read* (membaca data) adalah `< 200ms`.

### 5.2 Keamanan Aplikasi (Security)
* **Rate Limiting:** Mengimplementasikan batasan jumlah *request* (misalnya 100 request/menit per IP) pada *endpoint* krusial seperti Login/Register untuk mencegah serangan *Brute Force*.
* **Data Sanitization:** Mencegah serangan SQL Injection dan XSS (Cross-Site Scripting) dengan menggunakan ORM (seperti Prisma/TypeORM/Sequelize) dan *library validator* (Zod/Joi).

### 5.3 Logging dan Monitoring
* **Aplikasi:** Penggunaan Winston atau Pino di Node.js untuk logging tersetruktur.
* **Error Tracking:** Mengintegrasikan platform pemantauan seperti **Sentry** (opsional pada fase MVP) untuk melacak *bug* secara *real-time* di lingkungan *Production*.

---

## 6. Kebutuhan Data (Data Requirements)

### 6.1 Model Data Logis (Logical Data Model)
Struktur *database* relasional akan mencakup setidaknya tabel-tabel berikut:
* `Users` (id, nama, email, password_hash, role, created_at)
* `Classes` (id, mentor_id, judul, deskripsi, harga, thumbnail_url, status)
* `Modules` (id, class_id, urutan, judul, video_url)
* `Transactions` (id, student_id, class_id, amount, status [PENDING/PAID/FAILED], payment_method, updated_at)
* `User_Classes` (student_id, class_id, progress_percentage) - Tabel pivot untuk kepemilikan kelas.
* `Reviews` (id, class_id, student_id, rating, komentar)

### 6.2 Integritas Data
* Menggunakan *Foreign Keys* (FK) dengan aturan `ON DELETE RESTRICT` atau `CASCADE` yang dikonfigurasi dengan hati-hati untuk mencegah data menjadi *orphan* (yatim).
* Menggunakan *Database Transactions* (ACID) pada operasi yang melibatkan mutasi beberapa tabel sekaligus (misal: memproses *webhook* pembayaran).

---

## 7. Quality Assurance & Kriteria Penerimaan

* **Pengujian MVP:**
  * **Unit Testing:** Difokuskan pada fungsi bisnis kritis (kalkulasi harga, validasi token, *webhook handler*) menggunakan Jest/Vitest.
  * **Manual Testing:** *End-to-End* (E2E) testing skenario "Happy Path" di lingkungan Staging sebelum rilis ke Production.

---

## 8. Strategi Deployment dan DevOps

### 8.1 Lingkungan Infrastruktur (Environments)
1. **Local:** Komputer masing-masing *developer* (menggunakan Docker *compose* untuk database lokal).
2. **Staging:** Lingkungan mirip *production* untuk pengujian integrasi penuh (menggunakan Sandbox API dari *Payment Gateway*).
3. **Production:** Lingkungan berhadapan langsung dengan pengguna.

### 8.2 Arsitektur Deployment (MVP Tech Stack)
* **Frontend:** Di-*deploy* ke **Vercel** atau **Netlify** yang memiliki fitur CI/CD bawaan dan CDN (*Content Delivery Network*) global.
* **Backend:** Di-*deploy* menggunakan kontainer (Docker) ke platform PaaS seperti **Railway**, **Render**, atau VPS (DigitalOcean Droplets dengan PM2/Docker).
* **Database:** Managed Database PostgreSQL dari Supabase, Neon, atau Railway untuk memudahkan pencadangan data (*backup* otomatis).
* **CI/CD Pipeline:** Menggunakan **GitHub Actions** untuk menjalankan _linter_ (ESLint), _type checking_ (TypeScript), dan _unit test_ secara otomatis setiap ada *Pull Request*.

---

## 9. Arsitektur Sistem (System Architecture)

* **Pola Arsitektur:** Client-Server Architecture via REST API.
* **Design Pattern Backend:** Pola *MVC (Model-View-Controller)* atau *Layered Architecture* (Controller, Service, Repository) untuk memisahkan logika bisnis dari lapisan *routing* HTTP.
* **ORM:** Prisma atau TypeORM untuk abstraksi kueri database (*Type-Safe Database Access*).

---

## 10. Risiko yang Diketahui & Mitigasi (Known Risks & Mitigation)

| Risiko Teknis (Risk) | Probabilitas | Strategi Mitigasi (Mitigation Strategy) |
| :--- | :--- | :--- |
| **Kegagalan Pemrosesan Webhook** | Sedang | *Backend* harus merespons `200 OK` dengan cepat ke *Payment Gateway* dan memiliki mekanisme pengecekan ulang (*Cron Job*) untuk status pesanan `PENDING` yang kadaluarsa. |
| **Pencurian Konten Video** | Tinggi | Jika menggunakan YouTube Unlisted, URL masih bisa dibagikan. Untuk MVP risiko ini **diterima**. Ke depan (Post-MVP), migrasi ke *video hosting* dengan DRM (seperti AWS MediaLive / Mux) atau metode HLS (HTTP Live Streaming) + JWT *signed URL*. |
| **Downtime Layanan Pihak Ketiga** | Rendah | Menggunakan *Circuit Breaker* (opsional) atau *Error Handling* yang rapi agar sistem tidak *crash* sepenuhnya jika layanan eksternal bermasalah. |

---

## 11. Peningkatan di Masa Depan (Post-MVP Roadmap)
* Penggantian YouTube dengan server *streaming* khusus berbasis HLS (HTTP Live Streaming) untuk mempersulit pembajakan.
* Implementasi Redis untuk *Caching* respons API kelas/katalog demi meningkatkan performa secara masif.
* Fitur *Real-time Chat* atau forum diskusi antar siswa dan mentor di dalam platform menggunakan WebSockets (Socket.io).