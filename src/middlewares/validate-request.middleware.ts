import { errorResponse } from "#utils/response";
import { validationResult } from "express-validator";
import type { NextFunction, Request, Response } from "express";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return errorResponse(
    res,
    "Validasi request gagal",
    422,
    result.array().map((error) => ({
      field: "path" in error ? error.path : "request",
      message: error.msg,
    }))
  );
};
