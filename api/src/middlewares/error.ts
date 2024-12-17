import { ErrorRequestHandler } from "express";
import { sendErrorEmail } from "../utils/nodemailer";

export const errorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next
) => {
  res.json({
    success: false,
    message: "internal server error",
  });
  console.log(new Date().toISOString(), error);
  sendErrorEmail(error.message);
};
