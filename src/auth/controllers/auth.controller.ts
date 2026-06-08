import type { Request, Response } from "express";
import * as AuthService from "#auth/service/auth.service";
import { AppError } from "#utils/app-error";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.register(req.body);

  return successResponse(res, "Register berhasil", user, null, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  return successResponse(res, "Login berhasil", result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("User tidak terautentikasi", 401);
  }
  await AuthService.logout();

  return successResponse(res, "Logout berhasil", null);
});
