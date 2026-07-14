import type { NextFunction, Request, Response } from "express";
import * as ForgotPasswordService from "../service/forgot-password.service";

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ForgotPasswordService.forgotPassword(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      await ForgotPasswordService.verifyForgotPassword(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      await ForgotPasswordService.resetPassword(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};