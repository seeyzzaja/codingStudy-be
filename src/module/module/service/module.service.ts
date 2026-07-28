import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import logger from "#config/logger";

type AuthUser = {
  id: number;
  role?: string;
};

export const createModule = async (
  data: any,
  authUser: AuthUser
) => {
  const relatedClass = await prisma.class.findFirst({
    where: {
      id: data.classId,
      mentorId: authUser.id,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!relatedClass) {
    logger.warn("Gagal membuat module - Class tidak ditemukan", {
      mentorId: authUser.id,
      classId: data.classId,
    });

    throw new AppError("Class tidak ditemukan", 404);
  }

  const module = await prisma.module.create({
    data,
    include: {
      class: true,
    },
  });

  logger.info("Module berhasil dibuat", {
    moduleId: module.id,
    classId: module.classId,
    mentorId: authUser.id,
    judul: module.judul,
  });

  return module;
};

export const getAllModules = async (
  search?: string,
  classId?: string,
  page: number = 1,
  limit: number = 10
) => {
  return prisma.module.findMany({
    where: {
      deletedAt: null,

      ...(search && {
        judul: {
          contains: search,
          mode: "insensitive",
        },
      }),

      ...(classId && {
        classId,
      }),
    },

    include: {
      class: true,
    },

    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getModuleById = async (id: string) => {
  return prisma.module.findFirst({
    where: {
      id,
      deletedAt: null,
    },

    include: {
      class: true,
    },
  });
};

export const updateModule = async (
  id: string,
  data: any,
  authUser: AuthUser
) => {
  const existingModule = await prisma.module.findFirst({
    where: {
      id,
      deletedAt: null,

      class: {
        mentorId: authUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingModule) {
    logger.warn("Gagal mengupdate module - Module tidak ditemukan", {
      moduleId: id,
      mentorId: authUser.id,
    });

    throw new AppError("Module tidak ditemukan", 404);
  }

  const updatedModule = await prisma.module.update({
    where: {
      id,
    },
    data,
    include: {
      class: true,
    },
  });

  logger.info("Module berhasil diperbarui", {
    moduleId: updatedModule.id,
    mentorId: authUser.id,
  });

  return updatedModule;
};

export const deleteModule = async (
  id: string,
  authUser: AuthUser
) => {
  const existingModule = await prisma.module.findFirst({
    where: {
      id,
      deletedAt: null,

      class: {
        mentorId: authUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingModule) {
    logger.warn("Gagal menghapus module - Module tidak ditemukan", {
      moduleId: id,
      mentorId: authUser.id,
    });

    throw new AppError("Module tidak ditemukan", 404);
  }

  const deletedModule = await prisma.module.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  logger.info("Module berhasil dihapus", {
    moduleId: deletedModule.id,
    mentorId: authUser.id,
  });

  return deletedModule;
};