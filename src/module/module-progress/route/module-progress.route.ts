import { Router } from "express";
import { authenticate } from "#middlewares/auth.middlewares"
import { validateRequest } from "#middlewares/validate-request.middleware";
import {
  updateProgress,
  getProgressByClass,
} from "#module/module-progress/controller/module-progress.controller";
import {
  updateProgressValidation,
  getModuleProgressValidation,
} from "#module/module-progress/validation/module-progress.validation";
import {
  readLimiter,
  writeLimiter,
} from "#middlewares/rate-limit.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Module Progress
 *   description: Manajemen progress pembelajaran module
 */

/**
 * @swagger
 * /module-progress/{moduleId}:
 *   patch:
 *     summary: Memperbarui progress video pada module
 *     description: |
 *       Endpoint ini digunakan oleh student untuk menyimpan progress video.
 *       Backend akan menghitung persentase progress berdasarkan durasi video
 *       yang tersimpan pada module.
 *
 *       Jika progress mencapai 100%, maka module akan otomatis ditandai selesai.
 *
 *     tags: [Module Progress]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Module
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - watchedSeconds
 *             properties:
 *               watchedSeconds:
 *                 type: integer
 *                 minimum: 0
 *                 example: 320
 *                 description: Jumlah detik video yang sudah ditonton
 *
 *     responses:
 *       200:
 *         description: Progress berhasil diperbarui
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
 *                   example: Progress berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     moduleId:
 *                       type: string
 *                       format: uuid
 *                     watchedSeconds:
 *                       type: integer
 *                       example: 320
 *                     progress:
 *                       type: integer
 *                       example: 80
 *                     completed:
 *                       type: boolean
 *                       example: false
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *
 *       400:
 *         description: Request tidak valid atau durasi video belum diatur
 *
 *       401:
 *         description: User belum login
 *
 *       404:
 *         description: Module tidak ditemukan
 */
router.patch(
  "/:moduleId",
  writeLimiter,
  authenticate,
  updateProgressValidation,
  validateRequest,
  updateProgress
);

/**
 * @swagger
 * /module-progress/class/{classId}:
 *   get:
 *     summary: Mendapatkan daftar module beserta progress pembelajaran
 *     description: |
 *       Endpoint ini digunakan oleh student untuk melihat seluruh module
 *       pada sebuah class beserta progress belajar masing-masing module.
 *
 *       Data yang dikembalikan meliputi:
 *       - Informasi module
 *       - Jumlah detik video yang sudah ditonton
 *       - Persentase progress
 *       - Status selesai atau belum
 *       - Waktu penyelesaian module
 *
 *       Endpoint hanya dapat diakses oleh student yang sudah melakukan
 *       enrollment pada class tersebut.
 *
 *     tags: [Module Progress]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Class
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar module beserta progress
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
 *                   example: Berhasil mengambil progress module
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       classId:
 *                         type: string
 *                         format: uuid
 *                         example: 7d2f5f0d-8f0e-4b0d-8f56-c6cf4cdd9b20
 *                       urutan:
 *                         type: integer
 *                         example: 1
 *                       judul:
 *                         type: string
 *                         example: Pengenalan Node.js
 *                       deskripsi:
 *                         type: string
 *                         nullable: true
 *                         example: Belajar dasar-dasar Node.js
 *                       videoUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://youtu.be/xxxxxxxx
 *                       durationSeconds:
 *                         type: integer
 *                         example: 600
 *                       watchedSeconds:
 *                         type: integer
 *                         example: 480
 *                       progress:
 *                         type: integer
 *                         example: 80
 *                         description: Persentase progress video (0-100)
 *                       completed:
 *                         type: boolean
 *                         example: false
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *
 *       401:
 *         description: User belum login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User tidak terautentikasi
 *
 *       403:
 *         description: User belum melakukan enrollment pada class
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Anda belum terdaftar pada kelas ini
 *
 *       404:
 *         description: Class tidak ditemukan atau tidak memiliki module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Class tidak ditemukan
 */
router.get(
  "/class/:classId",
  readLimiter,
  authenticate,
  getModuleProgressValidation,
  validateRequest,
  getProgressByClass
);

export default router;
