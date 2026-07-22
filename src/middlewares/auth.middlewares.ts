import { errorResponse } from "#utils/response";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import config from "#config/env";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, "Authorization header wajib diisi", 401);
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return errorResponse(res, "Format token tidak valid", 401);
  }

  const token = parts[1];

  if (!token) {
    return errorResponse(res, "Token tidak ditemukan", 401);
  }

  try {
    const decoded = jwt.verify(token, config.ACCESS_SECRET);

    if (typeof decoded !== "object" || decoded === null || !("id" in decoded)) {
      return errorResponse(res, "Token tidak valid", 401);
    }

    const user = {
      id: Number((decoded as JwtPayload).id),
      ...(typeof (decoded as JwtPayload).role === "string"
        ? { role: (decoded as JwtPayload).role as string }
        : {}),
    };

    req.user = user;

    return next();
  } catch {
    return errorResponse(res, "Token tidak valid atau expired", 401);
  }
};
