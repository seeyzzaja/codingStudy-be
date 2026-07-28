import { z } from "zod";
import { validateSchema } from "#middlewares/validate-schema.middleware";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export const createReviewValidation =
  validateSchema(createReviewSchema);

export const updateReviewValidation =
  validateSchema(updateReviewSchema);