import bcrypt from "bcrypt";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import { compareToken, hashToken } from "#utils/hash";
import { generateAccessToken } from "#utils/jwt";
import { generateRefreshToken } from "#utils/token";

import * as otpService from "#module/email/otp.service";
import { sendEmail } from "#module/email/email.service";
import { renderRegisterOtpEmail } from "#module/email/email.template";
import logger from "#config/logger";

import type {
  LoginInput,
  RegisterInput,
  VerifyOtpInput,
} from "#module/auth/validation/auth.validation";
const SALT_ROUNDS = 10;
const sanitizeUser = <
  T extends {
    password: string;
    roleId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  },
>(
  user: T
) => {
  const { password, roleId, createdAt, updatedAt, deletedAt, ...safeUser } =
    user;

  return safeUser;
};

const findActiveSessionByToken = async (refreshToken: string) => {
  const sessions = await prisma.session.findMany({
    where: {
      revoked: false,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          deletedAt: true,
          isVerified: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  for (const session of sessions) {
    const isMatch = await compareToken(refreshToken, session.tokenHash);

    if (isMatch) {
      return session;
    }
  }

  return null;
};

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  // Email sudah terdaftar
  if (existingUser) {
    logger.warn("Registrasi gagal - Email sudah terdaftar", {
      email: data.email,
    });

    throw new AppError("Email sudah terdaftar", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const studentRole = await prisma.role.findUnique({
    where: {
      name: "STUDENT",
    },
  });

  if (!studentRole) {
    logger.error("Registrasi gagal - Role STUDENT tidak ditemukan");

    throw new AppError(
      "Role STUDENT tidak ditemukan. Jalankan seedRole terlebih dahulu.",
      500
    );
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: {
        connect: {
          id: studentRole.id,
        },
      },
    },
  });

  logger.info("User berhasil registrasi", {
    userId: user.id,
    email: user.email,
  });

  const otp = await otpService.createOtp(user.id);

  try {
    const html = await renderRegisterOtpEmail(user.name, otp);

    await sendEmail({
      to: user.email,
      subject: "Kode OTP Registrasi",
      html,
    });

    logger.info("OTP registrasi berhasil dikirim", {
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    logger.error("Gagal mengirim OTP registrasi", {
      userId: user.id,
      email: user.email,
      error: error instanceof Error ? error.message : error,
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    throw new AppError("Gagal mengirim email OTP", 500);
  }

  return sanitizeUser(user);
};

export const verifyOtp = async (data: VerifyOtpInput) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  // User tidak ditemukan
  if (!user) {
    logger.warn("Verifikasi OTP gagal - User tidak ditemukan", {
      email: data.email,
    });

    throw new AppError("User tidak ditemukan", 404);
  }

  // Email sudah diverifikasi
  if (user.isVerified) {
    logger.warn("Verifikasi OTP gagal - Email sudah diverifikasi", {
      userId: user.id,
      email: user.email,
    });

    throw new AppError("Email sudah diverifikasi", 400);
  }

  // Verifikasi OTP
  await otpService.verifyOtp(user.id, data.otp);

  // Update status user
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
    },
  });

  // Hapus OTP
  await otpService.deleteOtp(user.id);

  // Berhasil
  logger.info("Email berhasil diverifikasi", {
    userId: user.id,
    email: user.email,
  });

  return {
    message: "Email berhasil diverifikasi",
  };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Email tidak ditemukan
  if (!user) {
    logger.warn("Login gagal - Email tidak ditemukan", {
      email: data.email,
    });

    throw new AppError("Email atau password salah", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  // Password salah
  if (!isPasswordValid) {
    logger.warn("Login gagal - Password salah", {
      userId: user.id,
      email: user.email,
    });

    throw new AppError("Email atau password salah", 401);
  }

  // Email belum diverifikasi
  if (!user.isVerified) {
    logger.warn("Login gagal - Email belum diverifikasi", {
      userId: user.id,
      email: user.email,
    });

    throw new AppError("Silakan verifikasi email terlebih dahulu.", 403);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role.name,
  });

  const refreshToken = generateRefreshToken();

  const tokenHash = await hashToken(refreshToken);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash,
    },
  });

  // Login berhasil
  logger.info("User login berhasil", {
    userId: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};
export const refreshToken = async (token: string) => {
  if (!token || typeof token !== "string") {
    logger.warn("Refresh token gagal - Token tidak diberikan");

    throw new AppError("Refresh token wajib diisi", 400);
  }

  const normalizedToken = token.trim();

  if (!normalizedToken) {
    logger.warn("Refresh token gagal - Token kosong");

    throw new AppError("Refresh token wajib diisi", 400);
  }

  const session = await findActiveSessionByToken(normalizedToken);

  if (!session || session.user.deletedAt) {
    logger.warn("Refresh token gagal - Token tidak valid", {
      token: normalizedToken.substring(0, 10) + "...",
    });

    throw new AppError("Refresh token tidak valid", 401);
  }

  const newAccessToken = generateAccessToken({
    id: session.user.id,
    role: session.user.role.name,
  });

  logger.info("Refresh token berhasil", {
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role.name,
  });

  return {
    accessToken: newAccessToken,
  };
};

export const logout = async (userId: number, refreshToken?: string) => {
  if (refreshToken && refreshToken.trim()) {
    const session = await findActiveSessionByToken(refreshToken.trim());

    if (!session) {
      logger.warn("Logout gagal - Refresh token tidak valid", {
        userId,
      });

      throw new AppError("Refresh token tidak valid", 401);
    }

    if (session.userId !== userId) {
      logger.warn("Logout gagal - Refresh token tidak sesuai dengan user", {
        userId,
        sessionUserId: session.userId,
      });

      throw new AppError("Refresh token tidak sesuai dengan user", 403);
    }

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        revoked: true,
        deletedAt: new Date(),
      },
    });

    logger.info("Logout berhasil", {
      userId,
    });

    return {
      message: "Logout berhasil",
    };
  }

  await prisma.session.updateMany({
    where: {
      userId,
      revoked: false,
      deletedAt: null,
    },
    data: {
      revoked: true,
      deletedAt: new Date(),
    },
  });

  logger.info("Logout dari semua perangkat berhasil", {
    userId,
  });

  return {
    message: "Logout berhasil",
  };
};
