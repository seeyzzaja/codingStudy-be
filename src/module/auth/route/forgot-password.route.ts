import { Router } from "express";

import * as ForgotPasswordController from "../controllers/forgot-password.controller.js";

import { validateZod } from "#middlewares/validate-zod.middleware";

import {
  forgotPasswordSchema,
  verifyForgotPasswordSchema,
  resetPasswordSchema,
} from "#module/auth/validation/auth.validation";

const router = Router();

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Kirim OTP Reset Password
 *     description: Mengirim kode OTP ke email pengguna untuk proses reset password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: noval@gmail.com
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim.
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
 *                   example: OTP berhasil dikirim ke email.
 *       404:
 *         description: Email tidak ditemukan.
 *       500:
 *         description: Internal Server Error.
 */
router.post(
  "/forgot-password",
  validateZod(forgotPasswordSchema),
  ForgotPasswordController.forgotPassword
);

/**
 * @swagger
 * /api/auth/verify-forgot-password:
 *   post:
 *     summary: Verifikasi OTP Reset Password
 *     description: Memverifikasi kode OTP yang dikirim ke email pengguna.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: noval@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP valid.
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
 *                   example: OTP berhasil diverifikasi.
 *       400:
 *         description: OTP tidak valid atau sudah kedaluwarsa.
 *       404:
 *         description: Email tidak ditemukan.
 *       500:
 *         description: Internal Server Error.
 */
router.post(
  "/verify-forgot-password",
  validateZod(verifyForgotPasswordSchema),
  ForgotPasswordController.verifyForgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Mengubah password pengguna setelah OTP berhasil diverifikasi.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: noval@gmail.com
 *               password:
 *                 type: string
 *                 example: PasswordBaru123
 *               confirmPassword:
 *                 type: string
 *                 example: PasswordBaru123
 *     responses:
 *       200:
 *         description: Password berhasil diubah.
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
 *                   example: Password berhasil direset.
 *       400:
 *         description: Data tidak valid.
 *       404:
 *         description: Email tidak ditemukan.
 *       500:
 *         description: Internal Server Error.
 */
router.post(
  "/reset-password",
  validateZod(resetPasswordSchema),
  ForgotPasswordController.resetPassword
);

export default router;
