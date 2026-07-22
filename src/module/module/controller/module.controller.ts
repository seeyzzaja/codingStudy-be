import type { Request, Response } from "express";
import { asyncHandler } from "#utils/async.handler";
import { AppError } from "#utils/app-error";
import { successResponse } from "#utils/response";

import {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
} from "../service/module.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("User tidak terautentikasi", 401);
  }

  const result = await createModule(req.body, req.user);

  return successResponse(res, "Module berhasil dibuat", result, null, 201);
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { search, classId, page, limit } = req.query;

  const result = await getAllModules(
    search as string | undefined,
    classId as string | undefined,
    Number(page) || 1,
    Number(limit) || 10
  );

  return successResponse(res, "Berhasil mengambil daftar module", result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    throw new AppError("ID module wajib diisi", 400);
  }

  const result = await getModuleById(id);

  if (!result) {
    throw new AppError("Module tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengambil detail module", result);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    throw new AppError("ID module wajib diisi", 400);
  }

  if (!req.user) {
    throw new AppError("User tidak terautentikasi", 401);
  }

  const result = await updateModule(id, req.body, req.user);

  return successResponse(res, "Module berhasil diperbarui", result);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    throw new AppError("ID module wajib diisi", 400);
  }

if (!req.user) {
  throw new AppError("User tidak terautentikasi", 401);
}

await deleteModule(
  id,
  req.user
);

  return successResponse(res, "Module berhasil dihapus", null);
});
