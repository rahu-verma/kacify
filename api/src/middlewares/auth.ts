import { JwtPayload } from "jsonwebtoken";
import User, { Role } from "../models/user";
import { decodeJwt } from "../utils/jwt";
import { errorCatcher } from "./error";
import { response401, response403 } from "../utils/request";

export const authVerification = errorCatcher(async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    response401(res);
    return;
  }
  const decodedJwt = decodeJwt(authToken);
  const userId = (decodedJwt as JwtPayload)["_id"];
  if (!userId) {
    response401(res);
    return;
  }
  const user = await User.findById(userId);
  if (!user) {
    response401(res);
    return;
  }
  if (!user.emailVerified) {
    response401(res, { message: "email not verified" });
    return;
  }
  req.user = user;
  next();
});

export const permissionVerification = (permissions: string[]) => {
  return errorCatcher(async (req, res, next) => {
    if (
      !permissions.every((permission) =>
        req.user.permissions.includes(permission)
      )
    ) {
      response403(res);
      return;
    }
    next();
  });
};

export const userVerification = (role: Role) => {
  return errorCatcher(async (req, res, next) => {
    if (req.user.role !== role) {
      response403(res);
      return;
    }
    next();
  });
};
