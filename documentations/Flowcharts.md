# Flowchart Sistem Coding Study

Dokumen ini memuat flowchart untuk alur-alur utama yang didefinisikan pada bagian **Fitur Sistem (Bagian 3)** dari dokumen System Requirements Specification (SRS).

## 1. Alur Autentikasi dan Manajemen Sesi
Menggambarkan proses login/registrasi pengguna hingga mendapatkan akses dan menyimpan sesi.

```mermaid
graph TD
    A[Pengguna] --> B{Pilih Metode}
    B -->|Register| C[Input Nama, Email, Password]
    B -->|Login| D[Input Email & Password]
    C --> E[Backend Hash Password & Create User]
    D --> F[Backend Memvalidasi Kredensial]
    F --> G{Kredensial Valid?}
    G -->|Tidak| H[Tampilkan Pesan Error 401]
    G -->|Ya| I[Backend Generate JWT & Refresh Token]
    I --> J[Simpan Hash Token ke Tabel Sessions]
    J --> K[Return Token ke Frontend]
    E --> L[Registrasi Berhasil]
```

## 2. Alur Lupa Password dan OTP (Future Phase)
Menggambarkan proses reset password menggunakan OTP yang dikirimkan via Email Sender.

```mermaid
graph TD
    A[Pengguna Klik 'Lupa Password'] --> B[Input Alamat Email]
    B --> C[Backend Verifikasi Email Terdaftar]
    C -->|Tidak| D[Tampilkan Pesan Error]
    C -->|Ya| E[Generate OTP & Simpan di Database]
    E --> F[Email Sender Mengirimkan OTP via Email]
    F --> G[Pengguna Input OTP di Frontend]
    G --> H[Backend Verifikasi OTP]
    H -->|Valid| I[Pengguna Input Password Baru]
    H -->|Tidak Valid / Expired| J[Tampilkan Error / Minta Ulang]
    I --> K[Password Berhasil Diperbarui]
```

## 3. Alur Onboarding Pengguna (Baru)
Menggambarkan proses pengguna baru memilih topik atau kategori kelas yang diminati setelah melakukan pendaftaran.

```mermaid
graph TD
    A[User Login Berhasil] --> B{onboardingCompleted = true?}
    B -->|Ya| C[Arahkan ke Dasbor Utama]
    B -->|Tidak| D[Frontend Panggil /api/onboarding/categories]
    D --> E[Tampilkan Pilihan Kategori Minat]
    E --> F[User Memilih Kategori (Kirim Array of UUIDs)]
    F --> G[POST /api/onboarding/complete]
    G --> H[Backend Simpan ke Tabel UserPreference]
    H --> I[Update User: onboardingCompleted = true]
    I --> J[Arahkan ke Dasbor Utama]
```

## 4. Alur Manajemen Kelas (Mentor) & RBAC
Menggambarkan proses Mentor dalam membuat silabus. Memanfaatkan Role-Based Access Control (RBAC).

```mermaid
graph TD
    A[Mentor] --> B[Membuka Halaman Manajemen Kelas]
    B --> C[Backend Memvalidasi Role: Mentor]
    C --> D[Buat/Pilih Kategori Kelas]
    D --> E[Buat Draft Kelas Baru]
    E --> F[Isi Info: Judul, Harga, Deskripsi, Thumbnail]
    F --> G[Simpan ke Tabel Classes status DRAFT]
    G --> H[Susun Modul Pembelajaran]
    H --> I[Simpan ke Tabel Modules: Judul, Video URL, Urutan]
    I --> J[Review Kelengkapan Materi]
    J --> K[Ubah Status Kelas menjadi 'PUBLISHED']
    K --> L[Kelas Muncul di Katalog Publik]
```

## 5. Alur Katalog dan Pencarian Kelas
Menggambarkan interaksi saat pengguna mencari kelas di halaman utama.

```mermaid
graph TD
    A[Pengguna] --> B[Masuk ke Halaman Discovery]
    B --> C[Terapkan Filter: Keyword, Mentor, Range Harga]
    C --> D[Frontend Minta Data via GET /api/courses]
    D --> E[Backend Melakukan Query & Paginate via Prisma]
    E --> F[(Database PostgreSQL)]
    F -.->|Return JSON Terstruktur| E
    E --> G[Frontend Menampilkan Data Kelas]
```

## 6. Alur Transaksi dan Checkout (Future Phase)
Menggambarkan langkah-langkah pembelian kelas, berinteraksi dengan sistem internal dan payment gateway eksternal.

```mermaid
graph TD
    A[Student] --> B[Klik 'Beli Kelas']
    B --> C[(Database)]
    C -.->|Buat Record| D[Transaction Status 'PENDING']
    D --> E[Backend Panggil API Payment Gateway]
    E --> F[Tampilkan Payment Link/Invoice]
    F --> G[Student Melakukan Pembayaran]
    G --> H[Payment Gateway Kirim Webhook Callback]
    H --> I[Backend Validasi Callback]
    I --> J{Valid & Lunas?}
    J -->|Tidak| K[Abaikan / Status FAILED]
    J -->|Ya| L[Update Transaksi ke 'PAID']
    L --> M[(Database)]
    M -.->|Insert ke User_Classes| N[Berikan Akses Kelas Secara Otomatis]
```

## 7. Alur Dasbor Belajar / Learning Experience (Future Phase)
Menggambarkan interaksi Student saat mengonsumsi materi kelas.

```mermaid
graph TD
    A[Student] --> B{Punya Akses Kelas di User_Classes?}
    B -->|Tidak| C[Arahkan ke Halaman Pembelian]
    B -->|Ya| D[Buka Dasbor Belajar]
    D --> E[Pilih Materi Modul dari Sidebar]
    E --> F[Tonton Video Pembelajaran]
    F --> G[Klik Tombol 'Tandai Selesai' pada Modul]
    G --> H[Sistem Update Progress Bar Belajar]
    H --> I[(Database)]
```
