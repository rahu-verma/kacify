import { Document, Types } from "mongoose";

export interface ProductType extends Document {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  user: Types.ObjectId | UserType | string;
}

export interface UserType extends Document {
  _id: string;
  email: string;
  password: string;
  forgotPasswordToken: number | null;
  role: "user" | "admin" | "vendor";
  permissions: string[];
  cart: { product: Types.ObjectId | ProductType | string; quantity: number }[];
  orders: {
    products: {
      product: Types.ObjectId | ProductType | string;
      quantity: number;
    }[];
    address: string;
    email: string;
  }[];
}
