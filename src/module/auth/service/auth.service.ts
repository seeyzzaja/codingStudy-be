import bcrypt from "bcrypt";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import { compareToken, hashToken } from "#utils/hash";
import { generateAccessToken } from "#utils/jwt";
import { generateRefreshToken } from "#utils/token";

import * as otpService from "#module/email/otp.service";
import { sendEmail } from "#module/email/email.service";
import { renderRegisterOtpEmail } from "#module/email/email.template";

import type {
  LoginInput,
  RegisterInput,
  VerifyOtpInput,
} from "#validation/auth.validation";
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

  if (existingUser) {
    throw new AppError("Email sudah terdaftar", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const studentRole = await prisma.role.findUnique({
    where: {
      name: "STUDENT",
    },
  });

  if (!studentRole) {
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

  const otp = await otpService.createOtp(user.id);

  try {
    const html = await renderRegisterOtpEmail(user.name, otp);

    await sendEmail({
      to: user.email,
      subject: "Kode OTP Registrasi",
      html,
    });
  } catch (error) {
    console.error("Brevo Error:", error);

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

  if (!user) {
    throw new AppError("User tidak ditemukan", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email sudah diverifikasi", 400);
  }

  await otpService.verifyOtp(user.id, data.otp);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
    },
  });

  await otpService.deleteOtp(user.id);

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

  if (!user) {
    throw new AppError("Email atau password salah", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Email atau password salah", 401);
  }

  if (!user.isVerified) {
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

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (token: string) => {
  if (!token || typeof token !== "string") {
    throw new AppError("Refresh token wajib diisi", 400);
  }

  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new AppError("Refresh token wajib diisi", 400);
  }

  const session = await findActiveSessionByToken(normalizedToken);

  if (!session || session.user.deletedAt) {
    throw new AppError("Refresh token tidak valid", 401);
  }

  const newAccessToken = generateAccessToken({
    id: session.user.id,
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
      throw new AppError("Refresh token tidak valid", 401);
    }

    if (session.userId !== userId) {
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

  return {
    message: "Logout berhasil",
  };
};
