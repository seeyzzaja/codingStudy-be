import prisma from "#prisma";
import { AppError } from "#utils/app-error";

export const createCategory = async (data: any) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: data.name,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (existingCategory) {
    throw new AppError("Category sudah ada", 400);
  }

  return prisma.category.create({
    data,
  });
};

export const getAllCategories = async (
  search?: string,
  page: number = 1,
  limit: number = 10
) => {
  return prisma.category.findMany({
    where: {
      deletedAt: null,

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },

    orderBy: {
      name: "asc",
    },

    skip: (page - 1) * limit,
    take: limit,
  });
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const updateCategory = async (
  id: string,
  data: any
) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!existingCategory) {
    throw new AppError("Category tidak ditemukan", 404);
  }

  if (data.name) {
    const duplicate = await prisma.category.findFirst({
      where: {
        name: data.name,
        deletedAt: null,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      throw new AppError("Nama category sudah digunakan", 400);
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      classes: {
        where: {
          deletedAt: null,
        },
      },
    },
  });

  if (!existingCategory) {
    throw new AppError("Category tidak ditemukan", 404);
  }

  if (existingCategory.classes.length > 0) {
    throw new AppError(
      "Category masih digunakan oleh class",
      400
    );
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};