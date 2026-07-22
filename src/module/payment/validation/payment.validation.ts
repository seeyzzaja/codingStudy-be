import { body, query,param } from "express-validator";

export const checkoutValidation = [
  body("classId")
    .notEmpty()
    .withMessage("Class ID wajib diisi")
    .isUUID()
    .withMessage("Class ID harus berupa UUID yang valid"),
];
export const paymentDetailValidation = [
  param("paymentId")
    .isUUID()
    .withMessage("Payment ID tidak valid"),
];
export const paymentHistoryValidation = [
  query("status")
    .optional()
    .isIn([
      "PENDING",
      "PAID",
      "FAILED",
      "EXPIRED",
      "REFUNDED",
    ])
    .withMessage(
      "Status harus salah satu dari PENDING, PAID, FAILED, EXPIRED, atau REFUNDED"
    ),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus berupa angka minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus berupa angka minimal 1"),
];