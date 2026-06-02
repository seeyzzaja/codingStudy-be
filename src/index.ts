import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {
  body,
  param,
  validationResult
} from 'express-validator';
import type { ValidationChain } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


interface CustomRequest extends Request {
  startTime?: number;
}

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
}

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


app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
  console.log(`Request masuk: ${req.method} ${req.path}`);
  req.startTime = Date.now();
  next();
});

// API Key middleware
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const apiKey = req.headers['x-api-key'];

//   if (!apiKey) {
//     return res.status(401).json({
//       success: false,
//       message: 'Header X-API-Key wajib diisi!'
//     });
//   }

//   if (apiKey !== 'secret-api-key-123') {
//     return res.status(403).json({
//       success: false,
//       message: 'API Key tidak valid!'
//     });
//   }

//   next();
// });

// ==================== DATA ====================
let products: Product[] = [
  {
    id: 1,
    nama: 'Laptop Gaming',
    deskripsi: 'Intel i7, RTX 3060',
    harga: 15000000
  },
  {
    id: 2,
    nama: 'Keyboard Mekanikal',
    deskripsi: 'Blue Switch, RGB',
    harga: 800000
  },
  {
    id: 3,
    nama: 'Mouse Wireless',
    deskripsi: 'Ergonomic, Silent Click',
    harga: 300000
  }
];

// ==================== RESPONSE HELPER ====================
const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: ApiResponse['pagination'] = undefined,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: ApiResponse['errors'] = undefined
) => {
  const response: ApiResponse = {
    success: false,
    message
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

// ==================== VALIDATION ====================
const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(v => v.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map((err: any) => ({
      field: err.path || 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
};

const createProductValidation = [
  body('nama')
    .trim()
    .notEmpty()
    .withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),

  body('deskripsi')
    .trim()
    .notEmpty()
    .withMessage('Deskripsi wajib diisi'),

  body('harga')
    .isNumeric()
    .withMessage('Harga harus angka')
    .custom(value => value > 0)
    .withMessage('Harga harus lebih dari 0')
];

const productIdValidation = [
  param('id')
    .isNumeric()
    .withMessage('ID harus angka')
];

// ==================== ROUTES ====================

// Home
app.get('/', (req: CustomRequest, res: Response) => {
  const waktuProses = Date.now() - (req.startTime || Date.now());

  return successResponse(res, 'Server aktif', {
    hari: 4,
    status: 'server nyala',
    waktuProses: `${waktuProses} ms`
  });
});

// Get all products
app.get('/api/products', (_req: Request, res: Response) => {
  return successResponse(res, 'Daftar produk', products);
});

// Get product by ID
app.get(
  '/api/products/:id',
  validate(productIdValidation),
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
      return errorResponse(res, 'Produk tidak ditemukan', 404);
    }

    return successResponse(res, 'Produk ditemukan', product);
  }
);

// Create product
app.post(
  '/api/products',
  validate(createProductValidation),
  (req: Request, res: Response) => {
    const { nama, deskripsi, harga } = req.body;

    const newProduct: Product = {
      id: products.length + 1,
      nama,
      deskripsi,
      harga: Number(harga)
    };

    products.push(newProduct);

    return successResponse(
      res,
      'Produk berhasil ditambahkan',
      newProduct,
      undefined,
      201
    );
  }
);

// Search product
app.get('/api/search', (req: Request, res: Response) => {
  const { name, max_price } = req.query;

  let result = products;

  if (name) {
    result = result.filter(p =>
      p.nama.toLowerCase().includes((name as string).toLowerCase())
    );
  }

  if (max_price) {
    result = result.filter(
      p => p.harga <= Number(max_price)
    );
  }

  return successResponse(res, 'Hasil pencarian', result);
});

// Update product
app.put(
  '/api/products/:id',
  validate([...productIdValidation, ...createProductValidation]),
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return errorResponse(res, 'Produk tidak ditemukan', 404);
    }

    products[index] = {
      ...products[index],
      ...req.body,
      harga: Number(req.body.harga)
    };

    return successResponse(
      res,
      'Produk berhasil diperbarui',
      products[index]
    );
  }
);

// Delete product
app.delete(
  '/api/products/:id',
  validate(productIdValidation),
  (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return errorResponse(res, 'Produk tidak ditemukan', 404);
    }

    const deletedProduct = products.splice(index, 1);

    return successResponse(
      res,
      'Produk berhasil dihapus',
      deletedProduct[0]
    );
  }
);

// Async test
app.get('/api/test-async', async (_req: Request, res: Response) => {
  await new Promise(resolve => setTimeout(resolve, 100));

  return successResponse(res, 'Async berhasil');
});

// 404 handler
app.use((req: Request, res: Response) => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} tidak ditemukan`,
    404
  );
});

// Global error handler
app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err.stack);
    const stack = err.stack;

    return errorResponse(
      res,
      err.message || 'Terjadi kesalahan server',
      500,
      process.env.NODE_ENV === 'development' && stack
        ? { stack }
        : undefined
    );
  }
);

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
  console.log('Header wajib: X-API-Key: secret-api-key-123');
});
