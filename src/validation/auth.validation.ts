import { z } from "zod";

/* ===========================
   REGISTER
=========================== */

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email tidak valid"),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/* ===========================
   VERIFY OTP
=========================== */

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email tidak valid"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP harus terdiri dari 6 digit"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

/* ===========================
   LOGIN
=========================== */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email tidak valid"),

  password: z
    .string()
    .min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/* ===========================
   REFRESH TOKEN
=========================== */

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(1, "Refresh token wajib diisi"),
});

export type RefreshTokenInput = z.infer<
  typeof refreshTokenSchema
>;

/* ===========================
   LOGOUT
=========================== */

export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .optional(),
});

export type LogoutInput = z.infer<
  typeof logoutSchema
>;