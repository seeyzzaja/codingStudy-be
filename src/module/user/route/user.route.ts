import {
  destroy,
  index,
  show,
  store,
  update,
} from "#module/user/controllers/user.controllers";
import { authenticate } from "#middlewares/auth.middlewares";
import { requireRole } from "#middlewares/require-role.middleware";
import { Router } from "express";
import { readLimiter, writeLimiter } from "#middlewares/rate-limit.middleware";

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/", readLimiter, authenticate, requireRole("ADMIN"), index);
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User berhasil diambil.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User tidak ditemukan.
 */
router.get("/:id", readLimiter, authenticate, requireRole("ADMIN"), show);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user
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
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - MENTOR
 *                   - STUDENT
 *     responses:
 *       201:
 *         description: User berhasil dibuat.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post("/", writeLimiter, authenticate, requireRole("ADMIN"), store);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - MENTOR
 *                   - STUDENT
 *     responses:
 *       200:
 *         description: User berhasil diperbarui.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User tidak ditemukan.
 */
router.put("/:id", writeLimiter, authenticate, requireRole("ADMIN"), update);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User berhasil dihapus.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User tidak ditemukan.
 */
router.delete(
  "/:id",
  writeLimiter,
  authenticate,
  requireRole("ADMIN"),
  destroy
);

export default router;
