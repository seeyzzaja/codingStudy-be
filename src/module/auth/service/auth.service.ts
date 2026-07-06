import bcrypt from "bcrypt";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import { compareToken, hashToken } from "#utils/hash";
import { generateAccessToken } from "#utils/jwt";
import { generateRefreshToken } from "#utils/token";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const sanitizeUser = <
  T extends {
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  },
>(
  user: T
) => {
  const { password, createdAt, updatedAt, deletedAt, ...safeUser } = user;
  return safeUser;
};

const findActiveSessionByToken = async (refreshToken: string) => {
  const sessions = await prisma.session.findMany({
    where: {
      revoked: false,
      deletedAt: null,
    },
    include: {
      user: true,
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
  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  if (existingUser) {
    throw new AppError("Email sudah terdaftar", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return sanitizeUser(user);
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new AppError("Email atau password salah", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Email atau password salah", 401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
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
    role: session.user.role,
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

    return { message: "Logout berhasil" };
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

  return { message: "Logout berhasil" };
};
