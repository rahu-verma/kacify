import User from "../models/user";
import { hashPassword } from "./bcrypt";

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  password = hashPassword(password);
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    verificationCode,
    emailVerified: false,
  });
  await user.save();
  return user;
};
