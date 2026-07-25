import type { Request, Response } from "express";

import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";
import { AppError } from "#utils/app-error";
import { getModuleProgressByClass } from "#module/module-progress/service/module-progress.service";

import { updateModuleProgress } from "../service/module-progress.service.js";

export const updateProgress = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    const moduleId = Array.isArray(req.params.moduleId)
      ? req.params.moduleId[0]
      : req.params.moduleId;

    if (!moduleId) {
      throw new AppError("ID module wajib diisi", 400);
    }

    const { watchedSeconds } = req.body;

    const result = await updateModuleProgress(
      req.user.id,
      moduleId,
      watchedSeconds
    );

    return successResponse(res, "Progress berhasil diperbarui", result);
  }
);
export const getProgressByClass = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    const classId = Array.isArray(req.params.classId)
      ? req.params.classId[0]
      : req.params.classId;

    if (!classId) {
      throw new AppError("ID class wajib diisi", 400);
    }

    const result = await getModuleProgressByClass(req.user.id, classId);

    return successResponse(res, "Berhasil mengambil progress module", result);
  }
);
