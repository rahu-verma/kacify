import { NextFunction, Request, RequestHandler, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import User, { TUser } from "../models/user";
import { decodeJwt } from "../utils/jwt";

interface TRequest extends Request {
  user: TUser;
}

export const authVerification = async (
  req: TRequest,
  res: Response,
  next: NextFunction
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
