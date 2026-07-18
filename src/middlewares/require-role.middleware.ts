import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "#utils/response";

export const requireRole =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (!req.user.role) {
      return errorResponse(res, "Role tidak ditemukan", 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        "Anda tidak memiliki hak akses",
        403
      );
    }

    next();
  };