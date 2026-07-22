import type { Request, Response } from "express";
import { AppError } from "#utils/app-error";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";
import * as courseModuleService from "#module/course/service/course-module.service";

export const getCourseModules = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

 const courseId = Array.isArray(req.params.courseId)
  ? req.params.courseId[0]
  : req.params.courseId;

if (!courseId) {
  throw new AppError("ID course wajib diisi", 400);
}

const modules = await courseModuleService.getCourseModules(
  courseId,
  req.user
);

    return successResponse(
      res,
      "Berhasil mengambil daftar module",
      modules
    );
  }
);
