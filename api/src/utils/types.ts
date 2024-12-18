import { Request } from "express";
import { Types } from "mongoose";

export interface UserRequest extends Request {
  user?: any;
}

export type ProductType = {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  user: Types.ObjectId | UserType;
};

export type UserType = {
  _id: string;
  email: string;
  password: string;
  forgotPasswordToken: number | null;
  role: "user" | "admin" | "vendor";
  permissions: string[];
};
