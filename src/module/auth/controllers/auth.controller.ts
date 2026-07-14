import type { Request, Response } from "express";
import * as AuthService from "#module/auth/service/auth.service";
import { AppError } from "#utils/app-error";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);

    return successResponse(
      res,
      "Register berhasil",
      user,
      null,
      201
    );
  }
);

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response) => {
    await AuthService.verifyOtp(req.body);

    return successResponse(
      res,
      "Verifikasi email berhasil",
      null
    );
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    return successResponse(
      res,
      "Login berhasil",
      result
    );
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body as {
      refreshToken: string;
    };

    const result =
      await AuthService.refreshToken(refreshToken);

    return successResponse(
      res,
      "Berhasil refresh token",
      result
    );
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(
        "User tidak terautentikasi",
        401
      );
    }

    const { refreshToken } = req.body as {
      refreshToken?: string;
    };

    await AuthService.logout(
      req.user.id,
      refreshToken
    );

    return successResponse(
      res,
      "Logout berhasil",
      null
    );
  }
);