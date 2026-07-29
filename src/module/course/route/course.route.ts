import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "#module/course/controller/course.controller";
import { authenticate } from "#middlewares/auth.middlewares";
import {
  createCourseValidation,
  deleteCourseValidation,
  getCourseByIdValidation,
  listCoursesValidation,
  updateCourseValidation,
  getCourseModulesValidation,
} from "#module/course/validation/course.validation";
import { requireRole } from "#middlewares/require-role.middleware";
import { getCourseModules } from "../controller/course-module.controller.js";
import { upload } from "#middlewares/upload.middleware";
import {
  readLimiter,
  writeLimiter,
  uploadLimiter,
} from "#middlewares/rate-limit.middleware";

const router = Router();

/**
 * @openapi
 * /api/courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses
 *     description: Mengambil daftar course dengan filter, sorting, dan pagination.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian pada title dan description.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED]
 *         description: Filter status course.
 *       - in: query
 *         name: mentorId
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan mentor.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Harga minimum.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Harga maksimum.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, price, title]
 *         description: Field yang dipakai untuk sorting.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Arah sorting.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman.
 *     responses:
 *       200:
 *         description: Daftar course berhasil diambil.
 */
router.get("/", readLimiter, listCoursesValidation, getAllCourses);
/**
 * @openapi
 * /api/courses/{courseId}/modules:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get modules by course
 *     description: Mengambil daftar module dari course yang telah dibeli oleh user. User harus login dan sudah memiliki enrollment pada course tersebut.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID course.
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar module.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil daftar module
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       classId:
 *                         type: string
 *                         format: uuid
 *                       urutan:
 *                         type: integer
 *                         example: 1
 *                       judul:
 *                         type: string
 *                         example: Pengenalan Flutter
 *                       deskripsi:
 *                         type: string
 *                         example: Belajar dasar Flutter.
 *                       videoUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://example.com/flutter-intro
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: User belum login atau token tidak valid.
 *       403:
 *         description: User belum membeli course.
 *       404:
 *         description: Course tidak ditemukan.
 */
router.get(
  "/:courseId/modules",
  readLimiter,
  authenticate,
  getCourseModulesValidation,
  getCourseModules
);
/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get course by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail course berhasil diambil.
 */
router.get("/:id", readLimiter, getCourseByIdValidation, getCourseById);

/**
 * @openapi
 * /api/courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - title
 *               - description
 *               - price
 *               - thumbnail
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "7c3c4b5b-8d6d-4a17-a7f0-9b7c5bcbf1d4"
 *               title:
 *                 type: string
 *                 example: "Node.js Fundamental"
 *               description:
 *                 type: string
 *                 example: "Belajar Node.js dari dasar"
 *               price:
 *                 type: number
 *                 example: 100000
 *               status:
 *                 type: string
 *                 enum:
 *                   - DRAFT
 *                   - PUBLISHED
 *                 example: DRAFT
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Course berhasil dibuat.
 *       400:
 *         description: Request tidak valid.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Hanya mentor yang dapat membuat course.
 *       404:
 *         description: Category tidak ditemukan.
 */
router.post(
  "/",
  uploadLimiter,
  authenticate,
  requireRole("MENTOR"),
  upload.single("thumbnail"),
  createCourseValidation,
  createCourse
);
/**
 * @openapi
 * /api/courses/{id}:
 *   put:
 *     tags:
 *       - Courses
 *     summary: Update course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "7c3c4b5b-8d6d-4a17-a7f0-9b7c5bcbf1d4"
 *               title:
 *                 type: string
 *                 example: "Node.js Fundamental Updated"
 *               description:
 *                 type: string
 *                 example: "Belajar Node.js dari dasar hingga mahir"
 *               price:
 *                 type: number
 *                 example: 150000
 *               status:
 *                 type: string
 *                 enum:
 *                   - DRAFT
 *                   - PUBLISHED
 *                 example: PUBLISHED
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Thumbnail baru (opsional)
 *
 *     responses:
 *       200:
 *         description: Course berhasil diperbarui.
 *       400:
 *         description: Request tidak valid.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Anda tidak memiliki akses ke course ini.
 *       404:
 *         description: Course atau Category tidak ditemukan.
 */
router.put(
  "/:id",
  uploadLimiter,
  authenticate,
  requireRole("MENTOR"),
  upload.single("thumbnail"),
  updateCourseValidation,
  updateCourse
);

/**
 * @openapi
 * /api/courses/{id}:
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Delete course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Course berhasil dihapus.
 */
router.delete(
  "/:id",
  writeLimiter,
  authenticate,
  requireRole("MENTOR"),
  deleteCourseValidation,
  deleteCourse
);

export default router;
