import rateLimit from "express-rate-limit";
// import type { Request, Response } from "express";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  skipSuccessfulRequests = false
) =>
  rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });

export const loginLimiter = createRateLimiter(
  FIFTEEN_MINUTES,
  5,
  "Terlalu banyak percobaan login.",
  true
);

export const registerLimiter = createRateLimiter(
  ONE_HOUR,
  5,
  "Terlalu banyak registrasi.",
  true
);

export const otpLimiter = createRateLimiter(
  TEN_MINUTES,
  3,
  "Terlalu banyak permintaan OTP.",
  true
);

export const verifyOtpLimiter = createRateLimiter(
  TEN_MINUTES,
  5,
  "Terlalu banyak percobaan verifikasi OTP.",
  true
);

export const refreshTokenLimiter = createRateLimiter(
  FIFTEEN_MINUTES,
  20,
  "Terlalu banyak permintaan refresh token.",
);

export const readLimiter = createRateLimiter(
  FIFTEEN_MINUTES,
  200,
  "Terlalu banyak permintaan."
);

export const writeLimiter = createRateLimiter(
  ONE_HOUR,
  50,
  "Terlalu banyak perubahan data."
);

export const uploadLimiter = createRateLimiter(
  ONE_HOUR,
  20,
  "Terlalu banyak upload file."
);

export const paymentLimiter = createRateLimiter(
  TEN_MINUTES,
  10,
  "Terlalu banyak transaksi."
);
export const forgotPasswordLimiter = createRateLimiter(
  TEN_MINUTES,
  3,
  "Terlalu banyak permintaan reset password.",
  true
);

export const verifyForgotPasswordLimiter = createRateLimiter(
  TEN_MINUTES,
  5,
  "Terlalu banyak percobaan verifikasi OTP reset password.",
  true
);

export const resetPasswordLimiter = createRateLimiter(
  FIFTEEN_MINUTES,
  5,
  "Terlalu banyak percobaan reset password.",
  true
);
