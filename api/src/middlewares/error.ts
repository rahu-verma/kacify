import { ErrorRequestHandler, RequestHandler } from "express";
import { sendErrorEmail } from "../utils/email";
import { logError } from "../utils/logger";
import { response500 } from "../utils/request";

export const errorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next
) => {
  try {
    console.error(error);
    response500(res);
    logError(error);
    sendErrorEmail(error);
  } catch (error) {
    console.error(error);
  }
};

export const errorCatcher =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
