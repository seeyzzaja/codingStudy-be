import bcrypt from "bcrypt";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import * as otpService from "#module/email/otp.service";
import { sendEmail } from "#module/email/email.service";
import type {
  ForgotPasswordInput,
  VerifyForgotPasswordInput,
  ResetPasswordInput,
} from "#validation/auth.validation";
import {
  renderForgotPasswordOtpEmail,
} from "#module/email/email.template";




export const forgotPassword = async (
  data: ForgotPasswordInput
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  if (!user) {
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
  } catch (error) {
    console.error(error);

    throw new AppError(
      "Gagal mengirim email",
      500
    );
  }

  return {
    message:
      "OTP berhasil dikirim ke email",
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

  if (!user) {
    throw new AppError(
      "User tidak ditemukan",
      404
    );
  }

  await otpService.verifyOtp(
    user.id,
    data.otp
  );

  return {
    message:
      "OTP berhasil diverifikasi",
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

  if (!user) {
    throw new AppError(
      "User tidak ditemukan",
      404
    );
  }

  const hashedPassword =
    await bcrypt.hash(data.password, 10);

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

  return {
    message:
      "Password berhasil diubah",
  };
};