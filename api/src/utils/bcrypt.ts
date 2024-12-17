import { compareSync, genSaltSync, hashSync } from "bcrypt";

export const hashPassword = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return compareSync(password, hashedPassword);
};
