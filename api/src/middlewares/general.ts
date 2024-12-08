import { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    data: {},
  });
};