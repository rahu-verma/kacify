import axios from "axios";
import { getAuthToken } from "./authToken";

export type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  userType: "admin" | "user" | "superuser";
};

type Response<Data> = {
  success: boolean;
  message: string;
  data: Data;
  code: string;
};

const request = async <ResponseData>(
  url: string,
  method: "GET" | "POST" | "PUT",
  data: Record<string, string | number> = {},
  headers: Record<string, string> = {}
): Promise<Response<ResponseData>> => {
  try {
    const response = await axios.request({
      baseURL: process.env.REACT_APP_API_URL,
      url,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        message: "unknown error",
        data: {},
        code: "unknown_error",
      }
    );
  }
};

const authRequest = async <ResponseData>(
  url: string,
  method: "GET" | "POST" | "PUT",
  data: Record<string, string> = {}
): Promise<Response<ResponseData>> => {
  return await request(url, method, data, {
    Authorization: getAuthToken(),
  });
};

export const fetchProducts = async () => {
  return await request<{ products: Product[] }>("product", "GET");
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return await request<{}>("user/register", "POST", {
    firstName,
    lastName,
    email,
    password,
  });
};

export const loginUser = async (email: string, password: string) => {
  return await request<{ authToken: string }>("user/login", "POST", {
    email,
    password,
  });
};

export const verifyEmail = async (email: string, verificationCode: number) => {
  return await request<{}>("user/verifyEmail", "POST", {
    email,
    verificationCode,
  });
};

export const getUserProfile = async () => {
  return await authRequest<{ user: User }>("user/profile", "GET");
};

export const forgotPassword = async (email: string) => {
  return await request<{}>("user/forgotPassword", "POST", {
    email,
  });
};

export const changePassword = async (
  email: string,
  verificationCode: number,
  password: string
) => {
  return await request<{}>("user/changePassword", "POST", {
    email,
    verificationCode,
    password,
  });
};

export const editUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return await authRequest<{}>("user/edit", "PUT", {
    firstName,
    lastName,
    email,
    password,
  });
};

export const addPermission = async (name: string) => {
  return await authRequest<{}>("permission/add", "POST", {
    name,
  });
};
