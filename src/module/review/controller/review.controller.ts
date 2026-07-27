import type{ NextFunction, Request, Response } from "express";

import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../service/review.service.js";

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await createReview({
      classId: req.params.id as string,
      studentId: req.user!.id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json({
      success: true,
      message: "Review berhasil dibuat",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await getReviews({
      classId: req.params.id as string,
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil review",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await updateReview({
      reviewId: req.params.reviewId as string,
      studentId: req.user!.id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil diperbarui",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteReview({
      reviewId: req.params.reviewId as string,
      studentId: req.user!.id,
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
