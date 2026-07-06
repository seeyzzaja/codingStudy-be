import { onboardingRepository } from "../onboarding.repository.js";

export const onboardingService = {
  async getCategories() {
    return onboardingRepository.getCategories();
  },

  async completeOnboarding(
    userId: number,
    categoryIds: string[]
  ) {
    await onboardingRepository.deletePreferences(
      userId
    );

    await onboardingRepository.createPreferences(
      userId,
      categoryIds
    );

    await onboardingRepository.completeOnboarding(
      userId
    );

    return {
      message: "Onboarding completed",
    };
  },
};
