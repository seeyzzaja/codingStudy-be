import logger from "#config/logger";
import { onboardingRepository } from "../onboarding.repository.js";

export const onboardingService = {
  async completeOnboarding(
    userId: number,
    categoryIds: string[]
  ) {
    logger.info("Memulai proses onboarding", {
      userId,
      totalCategories: categoryIds.length,
    });

    await onboardingRepository.deletePreferences(userId);

    await onboardingRepository.createPreferences(
      userId,
      categoryIds
    );

    await onboardingRepository.completeOnboarding(
      userId
    );

    logger.info("Onboarding berhasil diselesaikan", {
      userId,
      totalCategories: categoryIds.length,
    });

    return {
      message: "Onboarding completed",
    };
  },
};