import { Router } from "express";
import { validateRequest } from "#middlewares/validate-request.middleware";

import {
  createCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
  getCategoryByIdValidation,
  listCategoriesValidation,
} from "#module/category/validation/category.validation";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controller/category.controller.js";
import { readLimiter, writeLimiter } from "#middlewares/rate-limit.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Manajemen category
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat category baru
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend
 *               description:
 *                 type: string
 *                 example: Category pembelajaran Backend Development
 *     responses:
 *       201:
 *         description: Category berhasil dibuat
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
  writeLimiter,
  createCategoryValidation,
  validateRequest,
  create
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mendapatkan daftar category
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan nama category
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
 *         description: Berhasil mengambil daftar category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *       400:
 *         description: Query parameter tidak valid
 */
router.get("/", readLimiter, listCategoriesValidation, validateRequest, getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mendapatkan detail category berdasarkan ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Category
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail category
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
 *         description: Category tidak ditemukan
 */
router.get(
  "/:id",
  readLimiter,
  getCategoryByIdValidation,
  validateRequest,
  getById
);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Memperbarui category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Frontend
 *               description:
 *                 type: string
 *                 example: Category Frontend Development
 *     responses:
 *       200:
 *         description: Category berhasil diperbarui
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
 *         description: Category tidak ditemukan
 */
router.patch(
  "/:id",
  writeLimiter,
  updateCategoryValidation,
  validateRequest,
  update
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Menghapus category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Category
 *     responses:
 *       200:
 *         description: Category berhasil dihapus
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
 *         description: Category tidak ditemukan
 */
router.delete(
  "/:id",
  writeLimiter,
  deleteCategoryValidation,
  validateRequest,
  remove
);

export default router;
