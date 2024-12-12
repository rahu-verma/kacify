import { TUser } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user: TUser;
      data?: any;
      responseMessage?: string;
    }
  }
}

export {};
