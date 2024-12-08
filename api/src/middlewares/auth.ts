import { NextFunction, RequestHandler, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import User, { Role } from "../models/user";
import { decodeJwt } from "../utils/jwt";
import { UserRequest } from "../utils/types";
import { UserRouterProfileSerializer } from "../utils/serializers";

export const authVerification = async (
  req: UserRequest,
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
    if(!user.emailVerified){
      res.status(401).json({
        success: false,
        message: "email not verified",
        data: UserRouterProfileSerializer(user),
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const permissionVerification = (
  permissions: string[]
): RequestHandler => {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (
        !permissions.every((permission) =>
          req.user.permissions.includes(permission)
        )
      ) {
        res.status(403).json({
          success: false,
          message: "permission denied",
          data: {},
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const userVerification = (role: Role): RequestHandler => {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user.role !== role) {
        res.status(403).json({
          success: false,
          message: "permission denied",
          data: {},
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
