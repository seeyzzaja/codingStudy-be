import {
  destroy,
  index,
  show,
  store,
  update,
} from "#user/controllers/user.controllers";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manajemen data pengguna
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan daftar semua user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar user
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
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *                       role:
 *                         type: string
 *                         enum: [STUDENT, MENTOR, ADMIN]
 *                         example: STUDENT
 *                       avatar:
 *                         type: string
 *                         nullable: true
 *                         example: /api/uploads/avatar-john.png
 *                 meta:
 *                   nullable: true
 *       401:
 *         description: User tidak terautentikasi
 *       500:
 *         description: Gagal mengambil daftar user
 */
router.get("/", index);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Mendapatkan detail user berdasarkan ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID user
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [STUDENT, MENTOR, ADMIN]
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                 meta:
 *                   nullable: true
 *       400:
 *         description: ID user wajib diisi
 *       401:
 *         description: User tidak terautentikasi
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Gagal mengambil detail user
 */
router.get("/:id", show);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Membuat user baru
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: User berhasil dibuat
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
 *       401:
 *         description: User tidak terautentikasi
 *       500:
 *         description: Gagal membuat user
 */
router.post("/", store);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Memperbarui data user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
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
 *         description: ID user wajib diisi
 *       401:
 *         description: User tidak terautentikasi
 *       500:
 *         description: Gagal memperbarui user
 */
router.put("/:id", update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Menghapus user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID user
 *     responses:
 *       200:
 *         description: User berhasil dihapus
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
 *       400:
 *         description: ID user wajib diisi
 *       401:
 *         description: User tidak terautentikasi
 *       500:
 *         description: Gagal menghapus user
 */
router.delete("/:id", destroy);

export default router;
