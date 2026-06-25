import bcrypt from "bcrypt";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import { generateAccessToken } from "#utils/jwt";


type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  deletedAt: Date | null;
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

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
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
  const user = (await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  })) as AuthUser | null;

  if (!user) {
    throw new AppError("Email atau password salah", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Email atau password salah", 401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role ?? "user",
  });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
};
export const logout = async () => {
  return { message: "Logout berhasil" };
};
