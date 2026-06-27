import { Router } from "express";
import { onboardingController } from "./onboarding.controller.js";
import { authenticate } from "#middlewares/auth.middlewares";

const router = Router();

/**
 * @openapi
 * /api/onboarding/categories:
 *   get:
 *     tags:
 *       - Onboarding
 *     summary: Get onboarding categories
 *     description: Mengambil daftar kategori yang bisa dipilih saat onboarding.
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil.
 */
router.get(
  "/categories",
  onboardingController.getCategories
);

/**
 * @openapi
 * /api/onboarding/complete:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Complete onboarding
 *     description: Menyimpan kategori yang dipilih user saat onboarding.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - "550e8400-e29b-41d4-a716-446655440000"
 *                   - "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Onboarding berhasil diselesaikan.
 *       401:
 *         description: User tidak terautentikasi.
 */
router.post(
  "/complete",
  authenticate,
  onboardingController.complete
);

export default router;
