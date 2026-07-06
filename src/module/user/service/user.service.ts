import type { Prisma } from "@prisma/client";
import prisma from "#prisma";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
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
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },

  async update(id: number, data: UpdateUserInput): Promise<UserResponse> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
      select: publicUserSelect,
    });
  },

  async softDelete(id: number): Promise<UserResponse> {
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
