import { onboardingRepository } from "./onboarding.repository.js";

export const onboardingService = {
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
