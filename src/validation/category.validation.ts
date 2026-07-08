import { body, param, query } from "express-validator";

export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Nama category wajib diisi")
    .isString()
    .withMessage("Nama category harus berupa string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Nama category minimal 3 karakter"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description harus berupa string"),
];

export const updateCategoryValidation = [
  param("id")
    .isUUID()
    .withMessage("ID category tidak valid"),

  body("name")
    .optional()
    .isString()
    .withMessage("Nama category harus berupa string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Nama category minimal 3 karakter"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description harus berupa string"),
];

export const getCategoryByIdValidation = [
  param("id")
    .isUUID()
    .withMessage("ID category tidak valid"),
];

export const deleteCategoryValidation = [
  param("id")
    .isUUID()
    .withMessage("ID category tidak valid"),
];

export const listCategoriesValidation = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search harus berupa string"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit minimal 1 maksimal 100"),
];