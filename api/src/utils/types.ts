import { Request } from "express";
import { TUser } from "../models/user";

export interface TRequest extends Request {
  user: TUser;
}
