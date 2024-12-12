import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { errorCatcher } from "./error";
import { response400 } from "../utils/request";

export const requestBodyValidation = (schema: ZodSchema): RequestHandler => {
  return errorCatcher(async (req, res, next) => {
    const results = schema.safeParse(req.body);
    if (!results.success) {
      response400(res, {
        data: results.error.flatten().fieldErrors,
      });
      return;
    }
    next();
  });
};
