import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import logger from "#config/logger";

type AuthUser = {
  id: number;
  role?: string;
};

const myCourseService = {
  async findMyCourses(authUser: AuthUser) {
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!user) {
      logger.warn("Gagal mengambil course saya - User tidak ditemukan", {
        userId: authUser.id,
      });

      throw new AppError("User tidak ditemukan", 404);
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: authUser.id,
      },
      include: {
        class: {
          include: {
            mentor: {
              include: {
                role: true,
              },
            },
            category: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info("Berhasil mengambil daftar course user", {
      userId: authUser.id,
      totalCourses: enrollments.length,
    });

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      paymentStatus: enrollment.payment?.status ?? null,
      purchasedAt: enrollment.createdAt,

      course: {
        id: enrollment.class.id,
        title: enrollment.class.title,
        description: enrollment.class.description,
        thumbnailUrl: enrollment.class.thumbnailUrl,
        price: enrollment.class.price.toString(),
        status: enrollment.class.status,

        mentor: {
          id: enrollment.class.mentor.id,
          name: enrollment.class.mentor.name,
          email: enrollment.class.mentor.email,
        },

        category: enrollment.class.category,
      },
    }));
  },
};

export default myCourseService;