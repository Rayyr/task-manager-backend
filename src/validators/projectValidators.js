import { body, param } from "express-validator";

export const projectIdRule = param("id").isMongoId().withMessage("Invalid project id");

const optionalFields = [
  body("description")
    .optional({ values: "null" })
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
  body("color")
    .optional({ values: "null" })
    .matches(/^#[0-9a-fA-F]{6}$/).withMessage("Color must be a hex code like #3b82f6"),
];

export const createProjectRules = [
  body("name")
    .isString().withMessage("Name must be a string")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
  ...optionalFields,
];

export const updateProjectRules = [
  body("name")
    .optional()
    .isString().withMessage("Name must be a string")
    .trim()
    .notEmpty().withMessage("Name cannot be empty")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
  ...optionalFields,
];