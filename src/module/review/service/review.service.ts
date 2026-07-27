import prisma from "#prisma";
import { AppError } from "#utils/app-error";

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
  // Cek apakah course ada
  const course = await prisma.class.findUnique({
    where: {
      id: classId,
      deletedAt: null,
    },
  });

  if (!course) {
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
    throw new AppError("Anda harus membeli course ini terlebih dahulu", 403);
  }

  // Simpan review
  const review = await prisma.review.create({
    data: {
      classId,
      studentId,
      rating,
      comment: comment ?? null,
    },
  });

  return review;
};
export const getReviews = async ({ classId }: GetReviewsPayload) => {
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
    throw new AppError("Review tidak ditemukan", 404);
  }

  if (review.studentId !== studentId) {
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
    throw new AppError("Review tidak ditemukan", 404);
  }

  if (review.studentId !== studentId) {
    throw new AppError("Anda tidak memiliki akses", 403);
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};
