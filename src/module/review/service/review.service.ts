import prisma from "#prisma";
import { AppError } from "#utils/app-error";
import logger from "#config/logger";

interface CreateReviewPayload {
  classId: string;
  studentId: number;
  rating: number;
  comment?: string;
}

interface GetReviewsPayload {
  classId: string;
}

interface UpdateReviewPayload {
  reviewId: string;
  studentId: number;
  rating?: number;
  comment?: string;
}

interface DeleteReviewPayload {
  reviewId: string;
  studentId: number;
}

export const createReview = async ({
  classId,
  studentId,
  rating,
  comment,
}: CreateReviewPayload) => {
  const course = await prisma.class.findUnique({
    where: {
      id: classId,
      deletedAt: null,
    },
  });

  if (!course) {
    logger.warn("Gagal membuat review - Course tidak ditemukan", {
      classId,
      studentId,
    });

    throw new AppError("Course tidak ditemukan", 404);
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: studentId,
      classId,
      payment: {
        status: "PAID",
      },
    },
  });

  if (!enrollment) {
    logger.warn("Gagal membuat review - User belum membeli course", {
      classId,
      studentId,
    });

    throw new AppError(
      "Anda harus membeli course ini terlebih dahulu",
      403
    );
  }

  const review = await prisma.review.create({
    data: {
      classId,
      studentId,
      rating,
      comment: comment ?? null,
    },
  });

  logger.info("Review berhasil dibuat", {
    reviewId: review.id,
    classId,
    studentId,
    rating,
  });

  return review;
};

export const getReviews = async ({
  classId,
}: GetReviewsPayload) => {
  const reviews = await prisma.review.findMany({
    where: {
      classId,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  logger.info("Daftar review berhasil diambil", {
    classId,
    totalReviews: reviews.length,
  });

  return reviews;
};

export const updateReview = async ({
  reviewId,
  studentId,
  rating,
  comment,
}: UpdateReviewPayload) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    logger.warn("Gagal mengupdate review - Review tidak ditemukan", {
      reviewId,
      studentId,
    });

    throw new AppError("Review tidak ditemukan", 404);
  }

  if (review.studentId !== studentId) {
    logger.warn("Gagal mengupdate review - Akses ditolak", {
      reviewId,
      studentId,
    });

    throw new AppError(
      "Anda tidak memiliki akses",
      403
    );
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      ...(rating !== undefined && { rating }),
      ...(comment !== undefined && { comment }),
    },
  });

  logger.info("Review berhasil diperbarui", {
    reviewId,
    studentId,
  });

  return updatedReview;
};

export const deleteReview = async ({
  reviewId,
  studentId,
}: DeleteReviewPayload) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    logger.warn("Gagal menghapus review - Review tidak ditemukan", {
      reviewId,
      studentId,
    });

    throw new AppError("Review tidak ditemukan", 404);
  }

  if (review.studentId !== studentId) {
    logger.warn("Gagal menghapus review - Akses ditolak", {
      reviewId,
      studentId,
    });

    throw new AppError(
      "Anda tidak memiliki akses",
      403
    );
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  logger.info("Review berhasil dihapus", {
    reviewId,
    studentId,
  });
};