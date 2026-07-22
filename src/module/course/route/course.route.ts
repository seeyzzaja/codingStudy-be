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
  getCourseModulesValidation
} from "#module/course/validation/course.validation";
import { requireRole } from "#middlewares/require-role.middleware";
import { getCourseModules } from "../controller/course-module.controller.js";

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
router.get("/", listCoursesValidation, getAllCourses);

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
router.get("/:id", getCourseByIdValidation, getCourseById);

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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnailUrl:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *
 *     responses:
 *       201:
 *         description: Course berhasil dibuat.
 */
router.post(
  "/",
  authenticate,
  requireRole("MENTOR"),
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnailUrl:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *
 *     responses:
 *       200:
 *         description: Course berhasil diperbarui.
 */
router.put(
  "/:id",
  authenticate,
  requireRole("MENTOR"),
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
  authenticate,
  requireRole("MENTOR"),
  deleteCourseValidation,
  deleteCourse
);

export default router;
