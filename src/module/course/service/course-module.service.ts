import prisma from "#prisma";
import { AppError } from "#utils/app-error";

type AuthUser = {
  id: number;
  role?: string;
};

export const getCourseModules = async (
  courseId: string,
  authUser: AuthUser
) => {
  const course = await prisma.class.findFirst({
    where: {
      id: courseId,
      deletedAt: null,
      status: "PUBLISHED",
    },
  });

  if (!course) {
    throw new AppError("Course tidak ditemukan", 404);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_classId: {
        userId: authUser.id,
        classId: courseId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError(
      "Silakan beli course terlebih dahulu",
      403
    );
  }

  const modules = await prisma.module.findMany({
    where: {
      classId: courseId,
      deletedAt: null,
    },
    orderBy: {
      urutan: "asc",
    },
  });

  return modules;
};