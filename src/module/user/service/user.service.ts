import bcrypt from "bcrypt";
import type { Prisma } from "@prisma/client";
import prisma from "#prisma";
import { AppError } from "#utils/app-error";

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
    return prisma.user.findMany({
      where: activeUserWhere,
      select: publicUserSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findById(id: number): Promise<UserResponse | null> {
    return prisma.user.findFirst({
      where: {
        id,
        ...activeUserWhere,
      },
      select: publicUserSelect,
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        ...activeUserWhere,
      },
    });
  },

  async create(data: CreateUserInput): Promise<UserResponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new AppError("Email sudah digunakan", 409);
    }

    const role = await prisma.role.findUnique({
      where: {
        name: data.role,
      },
    });

    if (!role) {
      throw new AppError("Role tidak ditemukan", 404);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
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
  },

  async update(id: number, data: UpdateUserInput): Promise<UserResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingUser) {
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
        throw new AppError("Role tidak ditemukan", 404);
      }

      roleId = role.id;
    }

    let hashedPassword: string | undefined;

    if (data.password !== undefined) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
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
  },

  async softDelete(id: number): Promise<UserResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      throw new AppError("User tidak ditemukan", 404);
    }

    return prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: publicUserSelect,
    });
  },
};

export default userService;