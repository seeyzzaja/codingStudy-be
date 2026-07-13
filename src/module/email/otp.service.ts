import crypto from "node:crypto";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";

const OTP_LENGTH = 6;
const OTP_EXPIRED_MINUTES = 10;

export const generateOtpCode = (): string => {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;

  return crypto.randomInt(min, max + 1).toString();
};

export const createOtp = async (
  userId: number
): Promise<string> => {
  const code = generateOtpCode();

  const expiredAt = new Date(
    Date.now() + OTP_EXPIRED_MINUTES * 60 * 1000
  );

  await prisma.$transaction(async (tx) => {
    await tx.otp.deleteMany({
      where: {
        userId,
      },
    });

    await tx.otp.create({
      data: {
        userId,
        code,
        expiredAt,
      },
    });
  });

  return code;
};

export const verifyOtp = async (
  userId: number,
  otp: string
) => {
  const foundOtp = await prisma.otp.findFirst({
    where: {
      userId,
      code: otp,
    },
  });

  if (!foundOtp) {
    throw new AppError("OTP salah", 400);
  }

  if (foundOtp.expiredAt < new Date()) {
    throw new AppError("OTP sudah kedaluwarsa", 400);
  }

  return foundOtp;
};

export const deleteOtp = async (
  userId: number
): Promise<void> => {
  await prisma.otp.deleteMany({
    where: {
      userId,
    },
  });
};