import { ZodError, type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

import { errorResponse } from "#utils/response";

export const validateSchema =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(
          res,
          "Validasi request gagal",
          422,
          error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }))
        );
      }

      next(error);
    }
  };