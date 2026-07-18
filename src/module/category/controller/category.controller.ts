import type { Request, Response } from "express";
import { asyncHandler } from "#utils/async.handler";
import { AppError } from "#utils/app-error";
import { successResponse } from "#utils/response";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../service/category.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await createCategory(req.body);

  return successResponse(
    res,
    "Category berhasil dibuat",
    result,
    null,
    201
  );
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const result = await getAllCategories(
    search as string | undefined,
    Number(page) || 1,
    Number(limit) || 10
  );

  return successResponse(
    res,
    "Berhasil mengambil daftar category",
    result
  );
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    throw new AppError("ID category wajib diisi", 400);
  }

  const result = await getCategoryById(id);

  if (!result) {
    throw new AppError("Category tidak ditemukan", 404);
  }

  return successResponse(
    res,
    "Berhasil mengambil detail category",
    result
  );
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    throw new AppError("ID category wajib diisi", 400);
  }

  const result = await updateCategory(id, req.body);

  return successResponse(
    res,
    "Category berhasil diperbarui",
    result
  );
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    throw new AppError("ID category wajib diisi", 400);
  }

  await deleteCategory(id);

  return successResponse(
    res,
    "Category berhasil dihapus",
    null
  );
});