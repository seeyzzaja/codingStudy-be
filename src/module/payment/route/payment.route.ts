import { Router } from "express";
import { authenticate } from "#middlewares/auth.middlewares";
import {
  checkout,
  webhook,
  history,
  paymentDetail,
} from "../controller/payment.controller.js";
import {
 checkoutValidation,
  paymentHistoryValidation,
  paymentDetailValidation,
} from "#module/payment/validation/payment.validation";
import { validateRequest } from "#middlewares/validate-request.middleware";
const router = Router();



/**
 * @openapi
 * /api/payments/checkout:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Checkout course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *             properties:
 *               classId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Checkout berhasil
 */
router.post(
  "/checkout",
  authenticate,
  checkoutValidation,
  checkout
);

/**
 * @openapi
 * /api/payments/webhook:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Midtrans Webhook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - transaction_status
 *             properties:
 *               order_id:
 *                 type: string
 *               transaction_status:
 *                 type: string
 *                 example: settlement
 *               transaction_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook berhasil diproses
 */
router.post("/webhook", webhook);

/**
 * @openapi
 * /api/payments/{paymentId}:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Detail pembayaran
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail pembayaran
 *       404:
 *         description: Payment tidak ditemukan
 */
router.get(
  "/:paymentId",
  authenticate,
  paymentDetailValidation,
  validateRequest,
  paymentDetail
);

/**
 * @openapi
 * /api/payments/history:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Riwayat pembayaran user
 *     description: Mengambil daftar riwayat pembayaran milik user yang sedang login.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - PAID
 *             - FAILED
 *             - EXPIRED
 *             - REFUNDED
 *         description: Filter berdasarkan status pembayaran.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Jumlah data per halaman.
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat pembayaran.
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
 *                   example: Berhasil mengambil riwayat pembayaran
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       orderId:
 *                         type: string
 *                         example: COURSE-1784660470262
 *                       amount:
 *                         type: number
 *                         example: 200000
 *                       status:
 *                         type: string
 *                         example: PAID
 *                       transactionId:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       class:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                             example: React Fundamental
 *                           thumbnailUrl:
 *                             type: string
 *                             nullable: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 2
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: User belum login.
 */
router.get(
  "/history",
  authenticate,
  paymentHistoryValidation,
  validateRequest,
  history
);

export default router;
