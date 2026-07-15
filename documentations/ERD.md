# Entity Relationship Diagram (ERD) - Coding Study

Berdasarkan bagian **Kebutuhan Data (Bagian 6)** dari dokumen System Requirements Specification (SRS), berikut adalah Entity Relationship Diagram (ERD) dari sistem **Coding Study**.

```mermaid
erDiagram
    Users {
        uuid id PK
        string nama
        string email
        string password_hash
        uuid role_id FK
        datetime created_at
    }

    Roles {
        uuid id PK
        string name
        string description
        datetime created_at
    }

    Permissions {
        uuid id PK
        string name
        string description
        datetime created_at
    }

    Role_Permissions {
        uuid role_id PK, FK
        uuid permission_id PK, FK
    }

    Classes {
        uuid id PK
        uuid mentor_id FK
        string judul
        text deskripsi
        decimal harga
        string thumbnail_url
        string status "DRAFT | PUBLISHED"
    }

    Modules {
        uuid id PK
        uuid class_id FK
        int urutan
        string judul
        string video_url
    }

    Transactions {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        decimal amount
        string status "PENDING | PAID | FAILED"
        string payment_method
        datetime updated_at
    }

    User_Classes {
        uuid student_id PK, FK
        uuid class_id PK, FK
        decimal progress_percentage
    }

    Reviews {
        uuid id PK
        uuid class_id FK
        uuid student_id FK
        int rating
        text komentar
    }

    %% Relationships
    Roles ||--o{ Users : "ditetapkan ke"
    Roles ||--o{ Role_Permissions : "memiliki"
    Permissions ||--o{ Role_Permissions : "diberikan pada"
    
    Users ||--o{ Classes : "Mentor mengelola Kelas"
    Classes ||--o{ Modules : "memiliki Modul"
    
    Users ||--o{ Transactions : "Student melakukan"
    Classes ||--o{ Transactions : "dibeli melalui"
    
    Users ||--o{ User_Classes : "Student memiliki"
    Classes ||--o{ User_Classes : "dimiliki oleh"
    
    Users ||--o{ Reviews : "Student menulis"
    Classes ||--o{ Reviews : "menerima"
```

## Relasi Kunci:
1. **Roles ke Users (1:N):** Setiap peran (Role) dapat dimiliki oleh banyak pengguna.
2. **Roles dan Permissions (M:N) direpresentasikan oleh `Role_Permissions`:** Sebuah peran dapat memiliki banyak izin (Permissions), dan satu izin dapat diterapkan ke banyak peran.
3. **Users (Mentor) ke Classes (1:N):** Seorang Mentor dapat membuat banyak kelas.
4. **Classes ke Modules (1:N):** Setiap kelas dapat memiliki banyak modul video.
3. **Users (Student) ke Transactions (1:N):** Seorang siswa dapat melakukan banyak transaksi pembelian.
4. **Classes ke Transactions (1:N):** Sebuah kelas dapat dibeli dalam banyak transaksi.
5. **Users (Student) dan Classes (M:N) direpresentasikan oleh `User_Classes`:** Siswa dapat memiliki banyak kelas, dan kelas dapat dimiliki oleh banyak siswa. Tabel pivot ini juga digunakan untuk melacak `progress_percentage`.
6. **Users (Student) dan Classes (M:N) direpresentasikan oleh `Reviews`:** Siswa dapat memberikan ulasan untuk kelas yang telah dimilikinya.
