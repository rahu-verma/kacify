import { RequestHandler } from "express";
import { decodeJwt } from "../utils/jwt";
import User from "../models/user";
import { TRequest } from "../utils/types";
import { JwtPayload } from "jsonwebtoken";

export const authVerification: RequestHandler = async (
  req: TRequest,
  res,
  next
) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      res.status(401).json({
        success: false,
        message: "not authenticated",
        data: {},
      });
      return;
    }
    const decodedJwt = decodeJwt(authToken);
    if (!decodedJwt) {
      res.status(401).json({
        success: false,
        message: "not authenticated",
        data: {},
      });
      return;
    }
    const userId = (decodedJwt as JwtPayload)?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "not authenticated",
        data: {},
      });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "not authenticated",
        data: {},
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
