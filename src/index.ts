import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== INTERFACE ====================
// Interface untuk extend Request dengan custom properties
interface CustomRequest extends Request {
  startTime?: number;
}

// ==================== MIDDLEWARE ====================

// `helmet()`: Membantu mengamankan aplikasi Express dengan mengatur berbagai HTTP headers.
//             Ini melindungi dari beberapa kerentanan web yang diketahui seperti XSS.
app.use(helmet());                    // keamanan header
// `cors()`: Memungkinkan atau membatasi resource di server agar dapat diakses oleh domain lain (Cross-Origin Resource Sharing).
//           Sangat penting untuk API yang akan diakses oleh frontend dari domain berbeda.
app.use(cors());                      // biar bisa diakses dari frontend
// `morgan('dev')`: Middleware logging HTTP request. Format 'dev' memberikan output yang ringkas dan berwarna,
//                 sangat berguna saat pengembangan untuk melihat request yang masuk dan status responsnya.
app.use(morgan('dev'));               // logger cantik di terminal
app.use(express.json());              // baca body JSON

// ====== CUSTOM MIDDLEWARE ======
// Custom middleware adalah fungsi JavaScript yang memiliki akses ke objek request (req),
// objek response (res), dan fungsi middleware berikutnya dalam siklus request-response (next).
// Mereka dapat mengeksekusi kode apa pun, membuat perubahan pada objek request dan response,
// mengakhiri siklus request-response, atau memanggil middleware berikutnya.

// Custom Middleware – Tambah timestamp ke setiap request
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  console.log(`Request masuk: ${req.method} ${req.path}`);
  req.startTime = Date.now();
  next();
});

// Custom Middleware – Cek apakah ada header X-API-Key (simulasi autentikasi)
app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Header X-API-Key wajib diisi untuk akses API!"
    });
  }
  // Simulasi validasi API key (dalam produksi, cek ke database)
  if (apiKey !== 'secret-api-key-123') {
    return res.status(403).json({
      success: false,
      message: "API Key tidak valid!"
    });
  }
  next();
});

// ==================== DATA PRODUK E-COMMERCE ====================
// `interface Product`: Mendefinisikan struktur atau 'kontrak' untuk objek produk.
//                  Ini sangat berguna di TypeScript untuk memastikan semua objek produk memiliki properti
//                  `id`, `nama`, `deskripsi`, dan `harga` dengan tipe data yang sesuai, 
//                  sehingga mencegah bug terkait tipe data saat pengembangan.
interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
}

let products: Product[] = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 }
];

// ==================== RESPONSE HELPER ====================
// Response helpers ini dibuat untuk memastikan semua respons API memiliki format yang konsisten (misalnya, selalu ada `success`, `message`, dan `data`/`errors`).
// Ini memudahkan klien API untuk memproses respons dan meningkatkan pengalaman developer saat mengonsumsi API kita.

// Interface untuk Response
interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }> | { stack?: string };
}

// Success Response Helper
const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: { page: number; limit: number; total: number } | null = null,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

// Error Response Helper
const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: Array<{ field: string; message: string }> | { stack?: string } | null = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

// ==================== VALIDASI INPUT DENGAN EXPRESS-VALIDATOR ====================
// `express-validator` adalah middleware yang sangat kuat untuk memvalidasi data input dari request.
// Alur kerjanya biasanya: definisi aturan validasi -> menjalankan validasi di middleware -> memeriksa hasil validasi.
// Jika ada error validasi, kita bisa mengembalikan respons error yang rapi.

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map((err: { type: string; path?: string; msg: string }) => ({
      field: err.type === 'field' ? (err.path ?? 'unknown') : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
}

// Validasi untuk CREATE & UPDATE produk
const createProductValidation = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi wajib diisi'),
  
  body('harga')
    .isNumeric().withMessage('Harga harus angka')
    .custom(value => value > 0).withMessage('Harga harus lebih dari 0')
];

// Validasi untuk GET by ID produk
const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];

// ==================== ROUTES (sama seperti Hari 2 + tambahan validasi) ====================

app.get('/', (req: CustomRequest, res: Response) => {
  const waktuProses = Date.now() - (req.startTime || Date.now());
  successResponse(res, 'Selamat datang di e-commerce', {
    message: 'Selamat datang di e-commerce',
    hari: 4,
    status: 'server nyala',
    waktuProses: `${waktuProses} ms`
  }, null, 200)
})

app.get('/api/products', (req: Request, res: Response) => {
  successResponse(res, 'Daftar produk', products);
});

app.get('/api/products/:id', validate(getProductByIdValidation), (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    // Kita lempar error → nanti ditangkap global error handler
    throw new Error('Produk dengan ID tersebut tidak ditemukan');
  }

  successResponse(res, 'Produk ditemukan', product);
});

app.post('/api/products', createProductValidator, (req: Request, res: Response) => {
  const { nama, deskripsi, harga } = req.body;

  const newProduct = {
    id: products.length + 1,
    nama: String(nama),
    deskripsi: String(deskripsi),
    harga: Number(harga)
  }

  products.push(newProduct);

  return successResponse(res, 'Produk berhasil ditambahkan', newProduct, null, 201);
})

app.get('/api/search', (req: Request, res: Response) => {
  const { name, max_price } = req.query;
  let result = products;

  if (name) {
    result = result.filter(p => p.nama.toLowerCase().includes((name as string).toLowerCase()))
  }

  if (max_price) {
    result = result.filter(p => p.harga <= Number(max_price))
  }

  return successResponse(res, 'Hasil pencarian', result)
})

app.put('/api/products/:id', createProductValidator, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return errorResponse(res, 'Product tidak ditemukan', 404)
  }

  products[index] = { ...products[index], ...req.body }

  return successResponse(res, 'Product berhasil diperbarui', products[index], null, 200);
})

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return errorResponse(res, 'Product tidak ditemukan', 404)
  }

  const deletedProduct = products.splice(index, 1);

  return successResponse(res, 'Product berhasil dihapus', deletedProduct[0], null, 200);
})

// ==================== ERROR HANDLING ====================

// `asyncHandler`: Ini adalah fungsi *wrapper* yang gunanya adalah untuk menangani Promise yang di-reject
//                 (misalnya, karena error pada operasi database asynchronous) dan meneruskannya ke global error handler secara otomatis.
//                 Dengan ini, kita tidak perlu menulis `try-catch` di setiap *route handler* yang asinkron, 
//                 membuat kode lebih bersih dan mengurangi redundansi.
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve digunakan untuk memastikan fungsi fn yang dijalankan selalu mengembalikan Promise.
    // Ini penting agar .catch(next) dapat menangkap error yang terjadi, baik dari fungsi async
    // maupun fungsi synchronous yang melempar error. Tanpa asyncHandler, setiap fungsi controller
    // yang bersifat async dan berpotensi melempar error perlu dibungkus dengan try-catch manual.
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Contoh route async (nanti dipakai pas Sequelize)
app.get('/api/test-async', asyncHandler(async (req: Request, res: Response) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  successResponse(res, "Async berhasil!");
}));

// 404 Handler: Middleware ini harus diletakkan PALING AKHIR di antara semua route dan middleware lainnya.
//              Ini karena Express akan memproses request secara berurutan. Jika suatu request 
//              tidak cocok dengan route atau middleware sebelumnya, maka request tersebut 
//              akan mencapai handler ini, yang berarti route yang diakses tidak ditemukan.
app.use((req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
});

// Global Error Handler – INI YANG PALING PENTING HARI INI
// Middleware ini memiliki empat parameter (`err`, `req`, `res`, `next`), yang menandakan bahwa ini adalah error handling middleware.
// Express akan secara otomatis memanggil middleware ini ketika ada error yang terjadi
// di salah satu route atau middleware sebelumnya (misalnya, dari `throw new Error()` atau Promise yang di-reject).
// Ini adalah tempat sentral untuk mengelola semua error, mencegah server crash, 
// dan mengirimkan respons error yang konsisten kepada klien.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('ERROR:', err.message);

  // Kalau error validasi dari express-validator sudah ditangani di `validate` middleware.
  // Ini untuk error umum lain atau error yang kita `throw` manual.
  const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;

  errorResponse(res, err.message || 'Terjadi kesalahan server', statusCode, 
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
});

app.listen(PORT, () => {
  console.log(`Server E-Commerce HARI 4 jalan di http://localhost:${PORT}`);
  console.log(`Jangan lupa kirim header: X-API-Key: secret-api-key-123`);
});