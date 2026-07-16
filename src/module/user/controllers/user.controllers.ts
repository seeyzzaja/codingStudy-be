import type { Request, Response } from "express";
import userService from "#module/user/service/user.service";
import { errorResponse, successResponse } from "#utils/response";

const getValidUserId = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    errorResponse(res, "Valid user id is required", 400);
    return null;
  }

  return id;
};

export const index = async (_req: Request, res: Response) => {
  const users = await userService.findAll();

  return successResponse(res, "Users fetched successfully", users);
};

export const show = async (req: Request, res: Response) => {
  const id = getValidUserId(req, res);

  if (!id) return;

  const user = await userService.findById(id);

  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  return successResponse(res, "User fetched successfully", user);
};

export const store = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return errorResponse(
      res,
      "Name, email, password, dan role wajib diisi",
      400
    );
  }

  const validRoles = ["ADMIN", "MENTOR", "STUDENT"];

  if (!validRoles.includes(role)) {
    return errorResponse(res, "Role tidak valid", 400);
  }

  const user = await userService.create({
    name,
    email,
    password,
    role,
  });

  return successResponse(res, "User created successfully", user, null, 201);
};

export const update = async (req: Request, res: Response) => {
  const id = getValidUserId(req, res);

  if (!id) return;

  if (req.body.role) {
    const validRoles = ["ADMIN", "MENTOR", "STUDENT"];

    if (!validRoles.includes(req.body.role)) {
      return errorResponse(res, "Role tidak valid", 400);
    }
  }

  const user = await userService.update(id, req.body);

  return successResponse(res, "User updated successfully", user);
};

export const destroy = async (req: Request, res: Response) => {
  const id = getValidUserId(req, res);

  if (!id) return;

  const user = await userService.softDelete(id);

  return successResponse(res, "User deleted successfully", user);
};

const userController = {
  getUsers: index,
  getUserById: show,
  createUser: store,
  updateUser: update,
  deleteUser: destroy,
};

export default userController;