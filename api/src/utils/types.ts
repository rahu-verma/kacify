import { Request } from "express";

export interface UserRequest extends Request {
  user?: any;
}

export type ProductType = {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
};

export type UserType = {
  _id: string;
  email: string;
  password: string;
  forgotPasswordToken: number | null;
  role: "user" | "admin";
};
