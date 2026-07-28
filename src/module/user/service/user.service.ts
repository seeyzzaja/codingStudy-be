import bcrypt from "bcrypt";
import type { Prisma } from "@prisma/client";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import logger from "#config/logger";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
  isVerified: true,
  onboardingCompleted: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.UserSelect;

const activeUserWhere = {
  deletedAt: null,
} satisfies Prisma.UserWhereInput;

export type UserResponse = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "MENTOR" | "STUDENT";
};

export type UpdateUserInput = Partial<CreateUserInput>;

const userService = {
async findAll(): Promise<UserResponse[]> {
  const users = await prisma.user.findMany({
    where: activeUserWhere,
    select: publicUserSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  logger.info("Berhasil mengambil daftar user", {
    total: users.length,
  });

  return users;
},

  async findById(id: number): Promise<UserResponse | null> {
    const user = await prisma.user.findFirst({
      where: {
        id,
        ...activeUserWhere,
      },
      select: publicUserSelect,
    });

    if (!user) {
      logger.warn("User tidak ditemukan", {
        userId: id,
      });

      return null;
    }

    logger.info("Berhasil mengambil data user", {
      userId: id,
    });

    return user;
  },

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        ...activeUserWhere,
      },
    });

    if (!user) {
      logger.warn("User tidak ditemukan berdasarkan email", {
        email,
      });

      return null;
    }

   logger.info("Berhasil mengambil data user berdasarkan email", {
  userId: user.id,
});

    return user;
  },

  async create(data: CreateUserInput): Promise<UserResponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      logger.warn("Gagal membuat user - Email sudah digunakan", {
        email: data.email,
      });

      throw new AppError("Email sudah digunakan", 409);
    }

    const role = await prisma.role.findUnique({
      where: {
        name: data.role,
      },
    });

    if (!role) {
      logger.warn("Gagal membuat user - Role tidak ditemukan", {
        role: data.role,
      });

      throw new AppError("Role tidak ditemukan", 404);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: {
          connect: {
            id: role.id,
          },
        },
      },
      select: publicUserSelect,
    });
  logger.info("User berhasil dibuat", {
  userId: user.id,
  role: data.role,
});

    return user;
  },

  async update(id: number, data: UpdateUserInput): Promise<UserResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      logger.warn("Gagal mengupdate user - User tidak ditemukan", {
        userId: id,
      });

      throw new AppError("User tidak ditemukan", 404);
    }

    if (data.email !== undefined) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id,
          },
        },
      });

      if (emailExists) {
        logger.warn("Gagal mengupdate user - Email sudah digunakan", {
          userId: id,
          email: data.email,
        });

        throw new AppError("Email sudah digunakan", 409);
      }
    }

    let roleId: number | undefined;

    if (data.role !== undefined) {
      const role = await prisma.role.findUnique({
        where: {
          name: data.role,
        },
      });

      if (!role) {
        logger.warn("Gagal mengupdate user - Role tidak ditemukan", {
          role: data.role,
        });

        throw new AppError("Role tidak ditemukan", 404);
      }

      roleId = role.id;
    }

    let hashedPassword: string | undefined;

    if (data.password !== undefined) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),

        ...(data.email !== undefined
          ? {
              email: data.email,
            }
          : {}),

        ...(hashedPassword !== undefined
          ? {
              password: hashedPassword,
            }
          : {}),

        ...(roleId !== undefined
          ? {
              role: {
                connect: {
                  id: roleId,
                },
              },
            }
          : {}),
      },
      select: publicUserSelect,
    });
    logger.info("User berhasil diperbarui", {
      userId: updatedUser.id,
    });

    return updatedUser;
  },

  async softDelete(id: number): Promise<UserResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      logger.warn("Gagal menghapus user - User tidak ditemukan", {
        userId: id,
      });

      throw new AppError("User tidak ditemukan", 404);
    }
    const deletedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: publicUserSelect,
    });
    logger.info("User berhasil dihapus", {
      userId: deletedUser.id,
    });

    return deletedUser;
  },
};

export default userService;
