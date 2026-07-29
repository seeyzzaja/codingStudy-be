import bcrypt from "bcrypt";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import * as otpService from "#module/email/otp.service";
import { sendEmail } from "#module/email/email.service";
import type {
  ForgotPasswordInput,
  VerifyForgotPasswordInput,
  ResetPasswordInput,
} from "#module/auth/validation/auth.validation";
import {
  renderForgotPasswordOtpEmail,
} from "#module/email/email.template";
import logger from "#config/logger";



export const forgotPassword = async (
  data: ForgotPasswordInput
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  // Email tidak ditemukan
  if (!user) {
    logger.warn("Forgot password gagal - Email tidak ditemukan", {
      email: data.email,
    });

    throw new AppError(
      "Email tidak ditemukan",
      404
    );
  }

  const otp = await otpService.createOtp(user.id);

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Password OTP",
      html: await renderForgotPasswordOtpEmail(
        user.name,
        otp
      ),
    });

    logger.info("OTP reset password berhasil dikirim", {
      userId: user.id,
      email: user.email,
    });

  } catch (error) {
    logger.error("Gagal mengirim email reset password", {
      userId: user.id,
      email: user.email,
      error: error instanceof Error ? error.message : error,
    });

    throw new AppError(
      "Gagal mengirim email",
      500
    );
  }

  return {
    message: "OTP berhasil dikirim ke email",
  };
};

export const verifyForgotPassword = async (
  data: VerifyForgotPasswordInput
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  // User tidak ditemukan
  if (!user) {
    logger.warn("Verifikasi OTP reset password gagal - User tidak ditemukan", {
      email: data.email,
    });

    throw new AppError(
      "User tidak ditemukan",
      404
    );
  }

  await otpService.verifyOtp(
    user.id,
    data.otp
  );

  logger.info("OTP reset password berhasil diverifikasi", {
    userId: user.id,
    email: user.email,
  });

  return {
    message: "OTP berhasil diverifikasi",
  };
};


export const resetPassword = async (
  data: ResetPasswordInput
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  // User tidak ditemukan
  if (!user) {
    logger.warn("Reset password gagal - User tidak ditemukan", {
      email: data.email,
    });

    throw new AppError(
      "User tidak ditemukan",
      404
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await otpService.deleteOtp(user.id);

  await prisma.session.updateMany({
    where: {
      userId: user.id,
      revoked: false,
      deletedAt: null,
    },
    data: {
      revoked: true,
      deletedAt: new Date(),
    },
  });

  logger.info("Password berhasil direset", {
    userId: user.id,
    email: user.email,
  });

  return {
    message: "Password berhasil diubah",
  };
};