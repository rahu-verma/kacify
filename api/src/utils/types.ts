import { Request } from "express";
import { TUser } from "../models/user";

export interface UserRequest extends Request {
  user: TUser;
}
