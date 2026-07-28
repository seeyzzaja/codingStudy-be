import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import logger from "#config/logger";

export const updateModuleProgress = async (
  userId: number,
  moduleId: string,
  watchedSeconds: number
) => {
  // Cari module
  const module = await prisma.module.findFirst({
    where: {
      id: moduleId,
      deletedAt: null,
    },
    select: {
      id: true,
      classId: true,
      durationSeconds: true,
    },
  });

  if (!module) {
    logger.warn("Gagal update progress - Module tidak ditemukan", {
      userId,
      moduleId,
    });

    throw new AppError("Module tidak ditemukan", 404);
  }

  // Pastikan user sudah enroll
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      classId: module.classId,
    },
  });

  if (!enrollment) {
    logger.warn("Gagal update progress - User belum enroll", {
      userId,
      classId: module.classId,
    });

    throw new AppError("Anda belum terdaftar pada kelas ini", 403);
  }

  // Pastikan mentor sudah mengisi durasi video
  if (module.durationSeconds <= 0) {
    logger.warn("Gagal update progress - Durasi video belum diatur", {
      moduleId,
    });

    throw new AppError("Durasi video belum diatur", 400);
  }

  // Ambil progress sebelumnya
  const existingProgress = await prisma.moduleProgress.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId,
      },
    },
  });

  // Progress tidak boleh melebihi durasi video
  // dan tidak boleh lebih kecil dari progress sebelumnya
  const finalWatchedSeconds = Math.max(
    existingProgress?.watchedSeconds ?? 0,
    Math.min(watchedSeconds, module.durationSeconds)
  );

  // Hitung persentase
  const progress = Math.floor(
    (finalWatchedSeconds / module.durationSeconds) * 100
  );

  const completed = progress >= 100;

  const result = await prisma.moduleProgress.upsert({
    where: {
      userId_moduleId: {
        userId,
        moduleId,
      },
    },

    update: {
      watchedSeconds: finalWatchedSeconds,
      progress,
      completed,
      completedAt:
        completed && !existingProgress?.completedAt
          ? new Date()
          : existingProgress?.completedAt ?? null,
    },

    create: {
      userId,
      moduleId,
      watchedSeconds: finalWatchedSeconds,
      progress,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  logger.info("Progress module berhasil diperbarui", {
    userId,
    moduleId,
    progress,
    completed,
  });

  return result;
};

export const getModuleProgressByClass = async (
  userId: number,
  classId: string
) => {
  // Pastikan user sudah enroll
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      classId,
    },
  });

  if (!enrollment) {
    logger.warn("Gagal mengambil progress - User belum enroll", {
      userId,
      classId,
    });

    throw new AppError("Anda belum terdaftar pada kelas ini", 403);
  }

  const modules = await prisma.module.findMany({
    where: {
      classId,
      deletedAt: null,
    },

    orderBy: {
      urutan: "asc",
    },

    include: {
      progress: {
        where: {
          userId,
        },

        select: {
          watchedSeconds: true,
          progress: true,
          completed: true,
          completedAt: true,
        },
      },
    },
  });

  logger.info("Progress module berhasil diambil", {
    userId,
    classId,
    totalModule: modules.length,
  });

  return modules.map((module) => ({
    id: module.id,
    classId: module.classId,
    urutan: module.urutan,
    judul: module.judul,
    deskripsi: module.deskripsi,
    videoUrl: module.videoUrl,
    durationSeconds: module.durationSeconds,

    watchedSeconds: module.progress[0]?.watchedSeconds ?? 0,
    progress: module.progress[0]?.progress ?? 0,
    completed: module.progress[0]?.completed ?? false,
    completedAt: module.progress[0]?.completedAt ?? null,
  }));
};