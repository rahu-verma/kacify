import { RequestHandler } from "express";
import { response404 } from "../utils/request";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  response404(res);
  return;
};
