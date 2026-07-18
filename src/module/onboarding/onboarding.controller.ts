import type { Request, Response } from "express";
import { AppError } from "#utils/app-error";
import { onboardingService } from "./onboarding.service.js";

export const onboardingController = {

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
