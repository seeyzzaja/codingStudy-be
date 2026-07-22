import { Router } from "express";

import { authenticate } from "#middlewares/auth.middlewares";
import { getMyCourses } from "#module/my-course/controller/my-course.controller";

const router = Router();

/**
 * @openapi
 * /api/my-courses:
 *   get:
 *     tags:
 *       - My Courses
 *     summary: Get my purchased courses
 *     description: Mengambil seluruh course yang sudah dimiliki oleh user yang sedang login.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar course milik user.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", authenticate, getMyCourses);

export default router;
