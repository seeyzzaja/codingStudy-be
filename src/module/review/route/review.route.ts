import { Router } from "express";

import { authenticate } from "#middlewares/auth.middlewares";

import {
  createReviewController,
  getReviewsController,
  updateReviewController,
  deleteReviewController,
} from "../controller/review.controller.js";

import {
  createReviewValidation,
  updateReviewValidation,
} from "#module/review/validation/review.validation";
import { readLimiter, writeLimiter } from "#middlewares/rate-limit.middleware";

const router = Router();

/**
 * @openapi
 * /api/courses/{id}/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create review
 *     description: User yang sudah membeli course dapat memberikan rating dan komentar. User dapat membuat review lebih dari satu kali.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Course ini sangat bagus dan mudah dipahami.
 *     responses:
 *       201:
 *         description: Review berhasil dibuat.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: User belum membeli course.
 *       404:
 *         description: Course tidak ditemukan.
 */
router.post(
  "/courses/:id/reviews",
  writeLimiter,
  authenticate,
  createReviewValidation,
  createReviewController
);

/**
 * @openapi
 * /api/courses/{id}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews by course
 *     description: Mengambil daftar review beserta rata-rata rating dan total review pada suatu course.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Course
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar review.
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
 *                   example: Berhasil mengambil review
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *                       format: float
 *                       example: 4.8
 *                     totalReviews:
 *                       type: integer
 *                       example: 37
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           rating:
 *                             type: integer
 *                             minimum: 1
 *                             maximum: 5
 *                             example: 5
 *                           comment:
 *                             type: string
 *                             example: Course ini sangat mudah dipahami.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           student:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 12
 *                               name:
 *                                 type: string
 *                                 example: Muhammad Naufal
 *       404:
 *         description: Course tidak ditemukan.
 */
router.get(
  "/courses/:id/reviews",
  readLimiter,
  getReviewsController
);

/**
 * @openapi
 * /api/reviews/{reviewId}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update review
 *     description: User hanya dapat mengubah review miliknya sendiri.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Setelah update materinya semakin bagus.
 *     responses:
 *       200:
 *         description: Review berhasil diperbarui.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Anda tidak memiliki akses.
 *       404:
 *         description: Review tidak ditemukan.
 */
router.put(
  "/reviews/:reviewId",
  writeLimiter,
  authenticate,
  updateReviewValidation,
  updateReviewController
);

/**
 * @openapi
 * /api/reviews/{reviewId}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete review
 *     description: User hanya dapat menghapus review miliknya sendiri.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Review
 *     responses:
 *       200:
 *         description: Review berhasil dihapus.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Anda tidak memiliki akses.
 *       404:
 *         description: Review tidak ditemukan.
 */
router.delete(
  "/reviews/:reviewId",
  writeLimiter,
  authenticate,
  deleteReviewController
);

export default router;
