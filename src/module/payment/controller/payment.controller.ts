import paymentService from "#module/payment/service/payment.service";
import { AppError } from "#utils/app-error";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";
import type { Request, Response } from "express";
import { PaymentStatus } from "@prisma/client";

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("User tidak terautentikasi", 401);
  }

  const { classId } = req.body;

  const result = await paymentService.checkout(classId, req.user);

  return successResponse(res, "Checkout berhasil", result, null, 201);
});
export const webhook = asyncHandler(async (req: Request, res: Response) => {
  await paymentService.handleWebhook(req.body);

  return successResponse(res, "Webhook berhasil diproses", null);
});
export const history = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("User tidak terautentikasi", 401);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const result = await paymentService.paymentHistory(
  req.user,
  status as PaymentStatus | undefined,
  page,
  limit
);
  return successResponse(
    res,
    "Berhasil mengambil riwayat pembayaran",
    result.data,
    result.meta
  );
});
export const paymentDetail = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    const paymentId = Array.isArray(req.params.paymentId)
  ? req.params.paymentId[0]
  : req.params.paymentId;

if (!paymentId) {
  throw new AppError("Payment ID wajib diisi", 400);
}

const result = await paymentService.getPaymentDetail(
  paymentId,
  req.user
);

    return successResponse(res, "Berhasil mengambil detail pembayaran", result);
  }
);
