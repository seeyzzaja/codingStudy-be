import { z } from "zod";

export const onboardingSchema = z.object({
  categoryIds: z
    .array(z.string().uuid())
    .min(1, "Pilih minimal 1 kategori")
    .max(5, "Maksimal 5 kategori"),
});

export type OnboardingInput = z.infer<
  typeof onboardingSchema
>;