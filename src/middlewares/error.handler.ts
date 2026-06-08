import { Prisma } from "@prisma/client";
import { errorResponse } from "#utils/response";
import type { NextFunction, Request, Response } from "express";
import config from "#utils/env";
import { AppError } from "#utils/app-error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("[ERROR]", err.message);

  const statusCode =
    err instanceof Prisma.PrismaClientKnownRequestError
      ? err.code === "P2025"
        ? 404
        : err.code === "P2002"
          ? 409
          : 400
      : err instanceof AppError
      ? err.statusCode
      : err.message.includes("tidak ditemukan")
        ? 404
        : 500;

  errorResponse(
    res,
    err.message || "Terjadi kesalahan server",
    statusCode,
    config.NODE_ENV === "development" ? { stack: err.stack as string } : null
  );
};
