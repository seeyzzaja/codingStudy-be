import type { Request, Response } from "express";
import { AppError } from "#utils/app-error";
import { onboardingService } from "../service/onboarding.service.js";

export const onboardingController = {
  async getCategories(
    _req: Request,
    res: Response
  ) {
    const categories =
      await onboardingService.getCategories();

    return res.json(categories);
  },

  async complete(
    req: Request,
    res: Response
  ) {
    if (!req.user) {
      throw new AppError(
        "User tidak terautentikasi",
        401
      );
    }

    const userId = req.user.id;

    const { categoryIds } = req.body;

    const result =
      await onboardingService.completeOnboarding(
        userId,
        categoryIds
      );

    return res.json(result);
  },
};
