import {
  ErrorRequestHandler,
  RequestHandler
} from "express";
import { sendErrorEmail } from "../utils/email";
import { logError } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next
) => {
  try {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: {},
    });
    logError(error);
    await sendErrorEmail(error);
  } catch (error) {
    console.error(error);
  }
};

export const notFoundHandler: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    data: {},
  });
};
