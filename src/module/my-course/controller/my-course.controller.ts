import type { Request, Response } from "express";

import myCourseService from "#module/my-course/service/my-course.service";
import { AppError } from "#utils/app-error";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";

export const getMyCourses = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    const courses = await myCourseService.findMyCourses(req.user);

    return successResponse(
      res,
      "Berhasil mengambil daftar course milik user",
      courses
    );
  }
);
