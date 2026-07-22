import { Router } from "express";
import { validateRequest } from "#middlewares/validate-request.middleware";
import {
  createModuleValidation,
  deleteModuleValidation,
  // getModuleByIdValidation,
  listModulesValidation,
  updateModuleValidation,
} from "#module/module/validation/module.validation";
import { authenticate } from "#middlewares/auth.middlewares";
import { requireRole } from "#middlewares/require-role.middleware";
import {
  create,
  getAll,
  // getById,
  update,
  remove,
} from "../controller/module.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Module
 *   description: Manajemen module pembelajaran
 */

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Membuat module baru
 *     tags: [Module]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - urutan
 *               - judul
 *             properties:
 *               classId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               urutan:
 *                 type: integer
 *                 example: 1
 *               judul:
 *                 type: string
 *                 example: Pengenalan JavaScript
 *               deskripsi:
 *                 type: string
 *                 example: Module dasar untuk memahami konsep JavaScript
 *               videoUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/videos/javascript-intro
 *     responses:
 *       201:
 *         description: Module berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 meta:
 *                   nullable: true
 *       400:
 *         description: Data request tidak valid
 */
router.post(
  "/",
  authenticate,
  requireRole("MENTOR"),
  createModuleValidation,
  validateRequest,
  create
);
/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Mendapatkan daftar module
 *     tags: [Module]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian module
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter berdasarkan ID class
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 meta:
 *                   type: object
 *       400:
 *         description: Query parameter tidak valid
 */
router.get("/", listModulesValidation, validateRequest, getAll);

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Mendapatkan detail module berdasarkan ID
 *     tags: [Module]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID module
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 meta:
 *                   nullable: true
 *       404:
 *         description: Module tidak ditemukan
 */
router.get(
  "/",
  authenticate,
  requireRole("MENTOR"),
  listModulesValidation,
  validateRequest,
  getAll
);

/**
 * @swagger
 * /modules/{id}:
 *   patch:
 *     summary: Memperbarui data module
 *     tags: [Module]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               urutan:
 *                 type: integer
 *                 example: 2
 *               judul:
 *                 type: string
 *                 example: JavaScript Lanjutan
 *               deskripsi:
 *                 type: string
 *                 example: Pembaruan materi JavaScript lanjutan
 *               videoUrl:
 *                 type: string
 *                 nullable: true
 *                 format: uri
 *                 example: https://example.com/videos/javascript-advanced
 *     responses:
 *       200:
 *         description: Module berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 meta:
 *                   nullable: true
 *       400:
 *         description: Data request tidak valid
 *       404:
 *         description: Module tidak ditemukan
 */
router.patch(
  "/:id",
  authenticate,
  requireRole("MENTOR"),
  updateModuleValidation,
  validateRequest,
  update
);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Menghapus module
 *     tags: [Module]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID module
 *     responses:
 *       200:
 *         description: Module berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   nullable: true
 *                 meta:
 *                   nullable: true
 *       404:
 *         description: Module tidak ditemukan
 */
router.delete(
  "/:id",
  authenticate,
  requireRole("MENTOR"),
  deleteModuleValidation,
  validateRequest,
  remove
);

export default router;
