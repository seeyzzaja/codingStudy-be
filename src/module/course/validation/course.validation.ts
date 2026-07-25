import { ClassStatus } from "@prisma/client";
import { body, param, query } from "express-validator";

const classStatuses = Object.values(ClassStatus);
const sortableFields = ["createdAt", "updatedAt", "price", "title"] as const;

export const createCourseValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title wajib diisi")
    .isLength({ max: 255 })
    .withMessage("Title maksimal 255 karakter"),
  body("description").trim().notEmpty().withMessage("Description wajib diisi"),
  body("price")
    .notEmpty()
    .withMessage("Price wajib diisi")
    .isFloat({ min: 0 })
    .withMessage("Price harus berupa angka >= 0")
    .toFloat(),
  body("status")
    .optional()
    .isIn(classStatuses)
    .withMessage(`Status harus salah satu dari: ${classStatuses.join(", ")}`),
  body("mentorId")
    .optional()
    .isInt()
    .withMessage("mentorId harus berupa angka")
    .toInt(),
  body("categoryId")
    .notEmpty()
    .withMessage("Category wajib dipilih")
    .isUUID()
    .withMessage("Category ID tidak valid"),
];

export const updateCourseValidation = [
  param("id").isUUID().withMessage("ID course harus berupa UUID yang valid"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title tidak boleh kosong")
    .isLength({ max: 255 })
    .withMessage("Title maksimal 255 karakter"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description tidak boleh kosong"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price harus berupa angka >= 0")
    .toFloat(),
  body("status")
    .optional()
    .isIn(classStatuses)
    .withMessage(`Status harus salah satu dari: ${classStatuses.join(", ")}`),
  body("mentorId")
    .optional()
    .isInt()
    .withMessage("mentorId harus berupa angka")
    .toInt(),
];

export const getCourseByIdValidation = [
  param("id").isUUID().withMessage("ID course harus berupa UUID yang valid"),
];

export const listCoursesValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search tidak boleh kosong"),
  query("status")
    .optional()
    .isIn(classStatuses)
    .withMessage(`Status harus salah satu dari: ${classStatuses.join(", ")}`),
  query("mentorId")
    .optional()
    .isInt()
    .withMessage("mentorId harus berupa angka")
    .toInt(),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minPrice harus berupa angka >= 0")
    .toFloat(),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice harus berupa angka >= 0")
    .toFloat(),
  query("sortBy")
    .optional()
    .isIn(sortableFields as readonly string[])
    .withMessage(`sortBy harus salah satu dari: ${sortableFields.join(", ")}`),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder harus bernilai asc atau desc"),
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
export const getCourseModulesValidation = [
  param("courseId")
    .isUUID()
    .withMessage("ID course harus berupa UUID yang valid"),
];
export const deleteCourseValidation = [
  param("id").isUUID().withMessage("ID course harus berupa UUID yang valid"),
];
