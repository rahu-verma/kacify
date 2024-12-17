import { RequestHandler } from "express";
import { ZodSchema } from "zod";

export const validationHandler = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const parse = schema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        message: JSON.stringify(parse.error.format()),
      });
      return;
    }
    req.body = parse.data;
    next();
  };
};
