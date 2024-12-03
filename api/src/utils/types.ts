import { Request } from "express";
import { TUser } from "../models/user";

export interface UserRequest extends Request {
  user: TUser;
}

export interface RequestBodyValidatedRequest<BodyType> extends Request {
  body: BodyType;
}

export interface RequestBodyValidatedUserRequest<BodyType> extends UserRequest {
  body: BodyType;
}
