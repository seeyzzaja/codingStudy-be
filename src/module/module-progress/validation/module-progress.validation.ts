import { body, param } from "express-validator";

export const updateProgressValidation = [
  param("moduleId")
    .isUUID()
    .withMessage("moduleId harus berupa UUID yang valid"),

  body("watchedSeconds")
    .isInt({ min: 0 })
    .withMessage("watchedSeconds harus berupa angka >= 0")
    .toInt(),
];
export const getModuleProgressValidation = [
  param("classId")
    .isUUID()
    .withMessage("classId harus berupa UUID yang valid"),
];