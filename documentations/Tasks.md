# 📚 Coding Study Platform — Development Task Management

> **Version:** 1.3.0 | **Stack:** Node.js · Express · TypeScript · PostgreSQL · Prisma | Vite · React · Tailwind CSS
>
> **Legend:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low · 🔧 BE · 🎨 FE · 🗄️ DB · 🚀 DevOps · 🧪 QA

---

## 📋 Table of Contents

- [Phase 1 — Project Setup & Core Infrastructure](#phase-1)
- [Phase 2 — Authentication, OTP, & RBAC](#phase-2)
- [Phase 3 — Course Management (Mentor)](#phase-3)
- [Phase 4 — Category & Module Management](#phase-4)
- [Phase 5 — Transaction & Checkout](#phase-5)
- [Phase 6 — Learning Experience (Student Dashboard)](#phase-6)
- [Phase 7 — Review & Rating System](#phase-7)
- [Phase 8 — CI/CD & Deployment](#phase-8)

---

<a name="phase-1"></a>
## 🏗️ Phase 1 — Project Setup & Core Infrastructure
**Status: In Progress**

### 1.1 Backend Initialization
- [x] 🔧 Setup Node.js + Express + TypeScript
- [x] 🔧 Setup `tsconfig.json` dan config environment variables (`.env`)
- [x] 🔧 Setup middlewares utama (Cors, Helmet, Morgan)
- [x] 🔧 Setup sistem response standard (`successResponse`)
- [x] 🔧 Setup Global Error Handler middleware (`errorHandler`)
- [x] 🔧 Setup Swagger/OpenAPI untuk dokumentasi otomatis (diakses di `/api-docs`)

### 1.2 Database & ORM Setup
- [x] 🗄️ Setup PostgreSQL database
- [x] 🗄️ Setup Prisma ORM (`prisma.config.ts`, `schema.prisma` root)
- [x] 🗄️ Implement database migration system (`prisma migrate dev`)
- [x] 🗄️ Implement modular schema splitting (file `.prisma` terpisah di `src/prisma/schema`)
- [x] 🗄️ Setup database seed script untuk initial data seeding

### 1.3 Frontend Project Setup
- [x] 🎨 Inisiasi project Vite + React
- [x] 🎨 Setup Tailwind CSS & konfigurasi styling
- [ ] 🎨 Setup State Management (Zustand / Redux)
- [x] 🎨 Setup Axios / Fetch API wrapper untuk HTTP Request
- [x] 🎨 Setup *routing* struktur aplikasi dasar (React Router DOM)

---

<a name="phase-2"></a>
## 🔐 Phase 2 — Authentication, OTP, & RBAC
**Status: Partially Completed**

### 2.1 Database Schema (Auth & User)
- [x] 🗄️ Tabel `user` (id, email, password, role, onboardingCompleted, timestamps)
- [x] 🗄️ Tabel `sessions` (tokenHash, revoked, dll) untuk manage multiple refresh tokens
- [x] 🗄️ Tabel `UserPreference` untuk minatan user terhadap kategori
- [ ] 🗄️ Tabel `otp_requests` (id, email, otp_code, expires_at, is_used)

### 2.2 Auth API Implementation
- [x] 🔧 `POST /api/auth/register` — Registrasi user baru. Email unik, password di-hash.
- [x] 🔧 `POST /api/auth/login` — Verifikasi kredensial dan generate Session serta Token.
- [x] 🔧 `POST /api/auth/refresh-token` — Regenerate access token menggunakan valid refresh token.
- [x] 🔧 `POST /api/auth/logout` — Revoke active session dari database.
- [x] 🔧 Middleware `authenticate` — Memvalidasi request yang masuk via JWT bearer token.

### 2.3 Forgot Password & Email Sender
- [ ] 🔧 Setup NodeMailer / Integrasi provider email (SendGrid/Resend)
- [ ] 🔧 Service `EmailSender` untuk mengirim email transaksional
- [ ] 🔧 `POST /api/auth/forgot-password` — Generate OTP 6 digit, simpan ke `otp_requests`, kirim via email
- [ ] 🔧 `POST /api/auth/verify-otp` — Verifikasi kode OTP dan masa berlakunya
- [ ] 🔧 `POST /api/auth/reset-password` — Mengubah password user pasca verifikasi OTP

### 2.4 Role-Based Access Control (RBAC)
- [ ] 🔧 Middleware `requireRole` (RBAC Guard) untuk memeriksa roles dari payload token
- [ ] 🔧 Implementasi RBAC ke route course management (Mentor Only) dan user (Admin Only)

### 2.5 Onboarding API Implementation
- [x] 🔧 `GET /api/onboarding/categories` — Fetch daftar kategori
- [x] 🔧 `POST /api/onboarding/complete` — Simpan relasi ke `UserPreference`

### 2.6 User Management API
- [x] 🔧 CRUD API `/api/users` (Get All, Get Detail, Create, Update, Delete)

### 2.7 Frontend — Auth & Onboarding UI
- [x] 🎨 Buat halaman `/login` dan `/register`
- [ ] 🎨 Buat halaman `/forgot-password`, input Email, & input OTP 6-digit
- [ ] 🎨 Buat halaman reset password form (Password Baru & Konfirmasi)
- [x] 🎨 Buat halaman Onboarding `/onboarding` (Pemilihan minat bahasa pemrograman / kategori)
- [x] 🎨 Implementasi Protected Route & RBAC Wrapper component di sisi Client (`AppNavigator.tsx`)

---

<a name="phase-3"></a>
## 📚 Phase 3 — Course Management (Mentor)
**Status: Partially Completed**

### 3.1 Database Schema (Course)
- [x] 🗄️ Tabel `classes` (mentorId, categoryId, title, description, price, status [DRAFT/PUBLISHED], timestamps)

### 3.2 Course API Implementation
- [x] 🔧 `GET /api/courses` — Daftar class dengan filter pencarian dan pagination.
- [x] 🔧 `GET /api/courses/:id` — Detail course.
- [x] 🔧 `POST /api/courses` — Memasukkan class baru oleh Mentor.
- [x] 🔧 `PUT /api/courses/:id` — Mengupdate informasi class.
- [x] 🔧 `DELETE /api/courses/:id` — Soft delete/Hard delete course.
- [ ] 🔧 `POST /api/courses/:id/publish` — Endpoint state machine validasi & PUBLISH.

### 3.3 Frontend — Mentor Dashboard & Course UI
- [x] 🎨 Buat Dasbor Mentor (Ringkasan Statistik, Tabel Daftar Kelas)
- [x] 🎨 Buat form multi-step `/dashboard/classes/new` (Informasi Dasar, Harga, Thumbnail Upload)
- [x] 🎨 Buat halaman Katalog Kelas (Discovery) `/home` dengan UI Filter & Search
- [x] 🎨 Buat halaman Landing/Detail Kelas `/courses/:id` (Public View: Deskripsi, Silabus, Harga, CTA Beli)

---

<a name="phase-4"></a>
## 🗂️ Phase 4 — Category & Module Management
**Status: Partially Completed**

### 4.1 Database Schema (Category & Module)
- [x] 🗄️ Tabel `Category` (name, description, timestamps)
- [x] 🗄️ Tabel `modules` (classId, urutan, judul, deskripsi, videoUrl)

### 4.2 Category & Module API Implementation
- [x] 🔧 CRUD `/api/categories` — Manajemen Master Category.
- [x] 🔧 CRUD `/modules` — Manajemen modul/materi per kelas.

### 4.3 Frontend — Category & Module UI
- [ ] 🎨 Tabel Manajemen Kategori di Dasbor Admin
- [ ] 🎨 Halaman Manajemen Modul di Dasbor Mentor (UI Builder silabus)
- [ ] 🎨 Implementasi Drag & Drop untuk mengatur *urutan* modul
- [ ] 🎨 Modal/Form input penambahan modul (Judul, Deskripsi, Video URL/File)

---

<a name="phase-5"></a>
## 💳 Phase 5 — Transaction & Checkout
**Status: Partially Completed**

### 5.1 Database Schema (Transactions)
- [ ] 🗄️ Tabel `Transactions` (id, student_id, class_id, amount, status, payment_method)
- [ ] 🗄️ Tabel `User_Classes` (student_id, class_id, progress_percentage)

### 5.2 Checkout & Payment API
- [ ] 🔧 `POST /api/checkout/:classId` — Buat order `PENDING`.
- [ ] 🔧 Integrasi Payment Gateway (Midtrans/Xendit) API.
- [ ] 🔧 `POST /api/webhook/payment` — Callback webhook dari payment gateway.
- [ ] 🔧 Auto-assign hak akses ke `User_Classes` setelah lunas.

### 5.3 Frontend — Checkout UI
- [x] 🎨 Buat halaman Checkout Summary (`/courses/:id/checkout`)
- [ ] 🎨 Integrasi UI Payment Gateway (Midtrans Snap / Xendit iframe / Redirect)
- [ ] 🎨 Buat Halaman Sukses Pembayaran (Sukses / Menunggu Pembayaran / Gagal)

---

<a name="phase-6"></a>
## 🎓 Phase 6 — Learning Experience (Student Dashboard)
**Status: Partially Completed**

### 6.1 Learning Progress Tracking API
- [ ] 🔧 `GET /api/my-classes` — Menampilkan kelas yang telah dibeli.
- [ ] 🔧 Role/Purchase Guard Authorization untuk akses modul video.
- [ ] 🔧 `POST /api/my-classes/:classId/modules/:moduleId/done` — Tandai modul selesai.

### 6.2 Frontend — Learning Dashboard UI
- [x] 🎨 Buat halaman "Kelas Saya" di Dasbor Student `/dashboard`
- [x] 🎨 Buat Antarmuka Ruang Belajar `/courses/:id/learn` (Player Video & Sidebar)
- [ ] 🎨 Integrasi Video Player kustom (Jika bukan bawaan iframe)
- [ ] 🎨 Buat Checkbox/Tombol "Tandai Selesai" dan auto-update Progress Bar secara visual.

---

<a name="phase-7"></a>
## ⭐ Phase 7 — Review & Rating System
**Status: Not Started**

### 7.1 Database Schema & API
- [ ] 🗄️ Tabel `Reviews` (id, class_id, student_id, rating [1-5], komentar).
- [ ] 🔧 `POST /api/courses/:id/reviews` & `GET /api/courses/:id/reviews`.

### 7.2 Frontend — Review UI
- [ ] 🎨 Form UI ulasan dengan Star Rating dinamis (hanya muncul setelah kelas dibeli).
- [ ] 🎨 Komponen Testimonial Card untuk menampilkan *list review* di halaman katalog.

---

<a name="phase-8"></a>
## 🚀 Phase 8 — CI/CD & Deployment
**Status: Not Started**

### 8.1 Docker Containerization
- [ ] 🚀 Setup `Dockerfile` untuk Backend & Frontend.
- [ ] 🚀 Setup `.dockerignore`.
- [ ] 🚀 Buat `docker-compose.yml` untuk stack utuh lokal (Postgres + Backend + Frontend).

### 8.2 GitHub Workflow
- [ ] 🚀 Setup `.github/workflows/main.yml`.
- [ ] 🚀 Linting & Type Checking Job.
- [ ] 🚀 Build verification Job.
