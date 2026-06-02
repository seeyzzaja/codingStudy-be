# Flowchart Sistem Coding Study

Dokumen ini memuat flowchart untuk alur-alur utama yang didefinisikan pada bagian **Fitur Sistem (Bagian 3)** dari dokumen System Requirements Specification (SRS).

## 1. Alur Autentikasi dan Manajemen Sesi
Menggambarkan proses login/registrasi pengguna hingga mendapatkan akses.

```mermaid
graph TD
    A[Pengguna] --> B{Pilih Metode Login}
    B -->|Email/Password| C[Input Kredensial]
    B -->|OAuth| D[Login via Google/GitHub]
    C --> E[Backend Memvalidasi Data]
    D --> E
    E --> F{Kredensial Valid?}
    F -->|Tidak| G[Tampilkan Pesan Error]
    F -->|Ya| H[Backend Generate JWT<br>Access & Refresh Token]
    H --> I[Frontend Menyimpan Token<br>httpOnly cookie / in-memory]
    I --> J[Pengguna Masuk ke Sistem]
```

## 2. Alur Transaksi dan Checkout
Menggambarkan langkah-langkah pembelian kelas, berinteraksi dengan sistem internal dan payment gateway eksternal.

```mermaid
graph TD
    A[Student] --> B[Klik 'Beli Kelas']
    B --> C[(Database)]
    C -.->|Buat Record| D[Order Status 'PENDING']
    D --> E[Backend Panggil API Payment Gateway<br>Xendit/Midtrans]
    E --> F[Tampilkan Payment Link/Invoice]
    F --> G[Student Melakukan Pembayaran]
    G --> H[Payment Gateway Kirim Webhook Callback]
    H --> I[Backend Validasi Signature]
    I --> J{Valid & Lunas?}
    J -->|Tidak| K[Abaikan / Status FAILED]
    J -->|Ya| L[Update Order ke 'PAID']
    L --> M[(Database)]
    M -.->|Update| N[Berikan Akses Kelas Secara Otomatis]
```

## 3. Alur Dasbor Belajar (Learning Experience)
Menggambarkan interaksi Student saat mengonsumsi materi kelas.

```mermaid
graph TD
    A[Student] --> B{Punya Akses Kelas?}
    B -->|Tidak| C[Arahkan ke Halaman Pembelian]
    B -->|Ya| D[Buka Dasbor Belajar]
    D --> E[Pilih Materi dari Silabus Sidebar]
    E --> F[Tonton Video Pembelajaran<br>YouTube Iframe/React Player]
    F --> G[Klik Tombol 'Selesai' pada Modul]
    G --> H[Sistem Update Progress Bar Belajar]
    H --> I[(Database)]
```

## 4. Alur Manajemen Kelas (Mentor)
Menggambarkan proses Mentor dalam membuat silabus dan mempublikasikan kelas.

```mermaid
graph TD
    A[Mentor] --> B[Buat Draft Kelas Baru]
    B --> C[Isi Info: Judul, Harga, Deskripsi]
    C --> D[Upload Thumbnail ke Storage<br>Cloudinary/S3]
    D --> E[Susun Modul Pembelajaran]
    E --> F[Tambahkan Tautan Video<br>YouTube Unlisted]
    F --> G[Ubah Status Kelas menjadi 'PUBLISHED']
    G --> H[Kelas Muncul di Katalog Publik]
```

## 5. Alur Katalog dan Pencarian Kelas
Menggambarkan interaksi saat pengguna mencari kelas di halaman utama.

```mermaid
graph TD
    A[Pengguna] --> B[Masuk ke Halaman Discovery]
    B --> C[Terapkan Filter / Keyword]
    C --> D[Frontend Minta Data via REST API]
    D --> E[Backend Melakukan Query Filtering]
    E --> F[(Database PostgreSQL)]
    F -.->|Return JSON| E
    E --> G[Frontend Menampilkan Data Kelas<br>Paginated]
```
