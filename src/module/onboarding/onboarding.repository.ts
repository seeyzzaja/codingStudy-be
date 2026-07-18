import prisma from "#utils/prisma";

export const onboardingRepository = {
  deletePreferences(userId: number) {
    return prisma.userPreference.deleteMany({
      where: {
        userId,
      },
    });
  },

  createPreferences(
    userId: number,
    categoryIds: string[]
  ) {
    return prisma.userPreference.createMany({
      data: categoryIds.map((categoryId) => ({
        userId,
        categoryId,
      })),
    });
  },

  completeOnboarding(userId: number) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        onboardingCompleted: true,
      },
    });
  },
};
