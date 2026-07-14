import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { errorResponse } from "#utils/response";

export const validateZod =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(
          res,
          "Validasi request gagal",
          422,
          error.issues.map((issue) => ({
            field: issue.path.join(".") || "request",
            message: issue.message,
          }))
        );
      }

      return next(error);
    }
  };
