import { body, param, query } from "express-validator";

export const createModuleValidation = [
  body("classId").isUUID().withMessage("classId harus berupa UUID yang valid"),
  body("urutan")
    .isInt({ min: 1 })
    .withMessage("urutan harus berupa angka bulat >= 1")
    .toInt(),
  body("judul")
    .trim()
    .notEmpty()
    .withMessage("judul wajib diisi")
    .isLength({ min: 3 })
    .withMessage("judul minimal 3 karakter"),
  body("deskripsi")
    .optional()
    .isString()
    .withMessage("deskripsi harus berupa string"),
  body("videoUrl")
    .optional()
    .isURL()
    .withMessage("videoUrl harus berupa URL yang valid"),
];

export const updateModuleValidation = [
  param("id").isUUID().withMessage("id module harus berupa UUID yang valid"),
  body("urutan")
    .optional()
    .isInt({ min: 1 })
    .withMessage("urutan harus berupa angka bulat >= 1")
    .toInt(),
  body("judul")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("judul tidak boleh kosong")
    .isLength({ min: 3 })
    .withMessage("judul minimal 3 karakter"),
  body("deskripsi")
    .optional()
    .isString()
    .withMessage("deskripsi harus berupa string"),
  body("videoUrl")
    .optional({ nullable: true })
    .custom((value) => value === null || typeof value === "string")
    .withMessage("videoUrl harus berupa string atau null")
    .custom((value) => value === null || /^https?:\/\//i.test(value))
    .withMessage("videoUrl harus berupa URL yang valid"),
];

export const getModuleByIdValidation = [
  param("id").isUUID().withMessage("id module harus berupa UUID yang valid"),
];

export const listModulesValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong"),
  query("classId")
    .optional()
    .isUUID()
    .withMessage("classId harus berupa UUID yang valid"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa angka >= 1")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit harus berupa angka 1-100")
    .toInt(),
];

export const deleteModuleValidation = [
  param("id").isUUID().withMessage("id module harus berupa UUID yang valid"),
];
