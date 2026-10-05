//reads the results of express-validator rules
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";

export const x = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, "Validation failed", errors));
};
