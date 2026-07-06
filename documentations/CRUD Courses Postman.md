# CRUD Courses Postman

Base URL:

```text
http://localhost:3000/api
```

## 1. Login Mentor/Admin

Endpoint:

```http
POST /auth/login
```

Request body:

```json
{
  "email": "mentor@example.com",
  "password": "password123"
}
```

Ambil `data.accessToken` dari response, lalu gunakan sebagai Bearer Token untuk endpoint create, update, dan delete.

## 2. Create Course

Endpoint:

```http
POST /courses
```

Headers:

```text
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request body:

```json
{
  "title": "Node.js untuk Pemula",
  "description": "Belajar backend dari dasar sampai bisa membuat REST API.",
  "price": 199000,
  "thumbnailUrl": "https://example.com/node-course.jpg",
  "status": "DRAFT"
}
```

Catatan:

- Jika login sebagai `MENTOR`, `mentorId` otomatis memakai ID user login.
- Jika login sebagai `ADMIN`, Anda boleh menambahkan `mentorId` pada body.

## 3. Get All Courses

Endpoint:

```http
GET /courses
```

Contoh query:

```http
GET /courses?search=node&status=PUBLISHED&sortBy=price&sortOrder=asc&page=1&limit=10
```

Query yang didukung:

- `search`
- `status`
- `mentorId`
- `minPrice`
- `maxPrice`
- `sortBy=createdAt|updatedAt|price|title`
- `sortOrder=asc|desc`
- `page`
- `limit`

## 4. Get Course By ID

Endpoint:

```http
GET /courses/:id
```

Contoh:

```http
GET /courses/7b9f8d1b-9d04-4b14-b34b-768a8ca1edb1
```

## 5. Update Course

Endpoint:

```http
PATCH /courses/:id
```

Headers:

```text
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request body:

```json
{
  "title": "Node.js untuk Pemula Updated",
  "price": 249000,
  "status": "PUBLISHED"
}
```

Catatan:

- `MENTOR` hanya bisa mengubah course miliknya sendiri.
- `ADMIN` bisa mengubah course mana pun.

## 6. Delete Course

Endpoint:

```http
DELETE /courses/:id
```

Headers:

```text
Authorization: Bearer <accessToken>
```

Catatan:

- Delete menggunakan soft delete pada kolom `deleted_at`.
- Data yang sudah di-soft-delete tidak akan muncul di endpoint list dan detail.
