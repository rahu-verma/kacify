import { RequestHandler } from "express";
import { ZodSchema } from "zod";

export const requestBodyValidation = (schema: ZodSchema): RequestHandler => {
  return async (req, res, next) => {
    try {
      const results = schema.safeParse(req.body);
      if (!results.success) {
        res.status(400).json({
          success: false,
          message: "validation failed",
          data: results.error.format(),
          code: "validationFailed",
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
