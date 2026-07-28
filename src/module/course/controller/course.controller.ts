import courseService from "#module/course/service/course.service";
import { AppError } from "#utils/app-error";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";
import type { Request, Response } from "express";
import cloudinary from "#config/cloudinary";
import { Readable } from "stream";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    let thumbnailUrl: string | undefined;
if (!req.file) {
  throw new AppError("Thumbnail wajib diupload", 400);
}
    const file = req.file;

    if (file) {
      thumbnailUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "coding-study/courses",
          },
          (error, result) => {
            if (error || !result) {
              return reject(error);
            }

            resolve(result.secure_url);
          }
        );

        Readable.from(file.buffer).pipe(uploadStream);
      });
    }

    const mentorId =
      typeof req.body.mentorId === "string" && req.body.mentorId !== ""
        ? Number(req.body.mentorId)
        : undefined;

    const payload = {
      ...req.body,
      price: Number(req.body.price),
      ...(mentorId !== undefined ? { mentorId } : {}),
      thumbnailUrl,
    };

    const course = await courseService.create(
      payload,
      req.user
    );

    return successResponse(
      res,
      "Course berhasil dibuat",
      course,
      null,
      201
    );
  }
);
export const getAllCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const query: Parameters<typeof courseService.findAll>[0] = {};

    if (typeof req.query.search === "string") query.search = req.query.search;
    if (typeof req.query.status === "string") {
      query.status = req.query.status as "DRAFT" | "PUBLISHED";
    }
    if (typeof req.query.mentorId === "string") {
      const mentorId = Number(req.query.mentorId);
      if (!Number.isNaN(mentorId)) {
        query.mentorId = mentorId;
      }
    }
    if (typeof req.query.minPrice === "number")
      query.minPrice = req.query.minPrice;
    if (typeof req.query.maxPrice === "number")
      query.maxPrice = req.query.maxPrice;
    if (typeof req.query.sortBy === "string") {
      query.sortBy = req.query.sortBy as
        "createdAt" | "updatedAt" | "price" | "title";
    }
    if (typeof req.query.sortOrder === "string") {
      query.sortOrder = req.query.sortOrder as "asc" | "desc";
    }
    if (typeof req.query.page === "number") query.page = req.query.page;
    if (typeof req.query.limit === "number") query.limit = req.query.limit;

    const result = await courseService.findAll(query);

    return successResponse(
      res,
      "Berhasil mengambil daftar course",
      result.data,
      result.pagination
    );
  }
);

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      throw new AppError("ID course wajib diisi", 400);
    }

    const course = await courseService.findById(id);

    return successResponse(res, "Berhasil mengambil detail course", course);
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError("ID course wajib diisi", 400);
    }

    let thumbnailUrl: string | undefined;

    const file = req.file;

if (file) {
  thumbnailUrl = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "coding-study/courses",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
}

    const payload = {
      ...req.body,
      ...(req.body.price !== undefined
        ? { price: Number(req.body.price) }
        : {}),
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
    };

    const course = await courseService.update(
      id,
      payload,
      req.user
    );

    return successResponse(
      res,
      "Course berhasil diperbarui",
      course
    );
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      throw new AppError("ID course wajib diisi", 400);
    }

    await courseService.softDelete(id, req.user);

    return successResponse(res, "Course berhasil dihapus", null);
  }
);
