import axios from "axios";
import { User } from "../types/user";

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<User> => {
  const url = process.env.REACT_APP_API_URL + "/user/register";
  const response = await axios.post(url, {
    firstName,
    lastName,
    email,
    password,
  });
  return response.data.data.user;
};
