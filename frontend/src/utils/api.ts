import axios from "axios";
import { storeAuthToken } from "./common";

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
  email: string;
  password: string;
};

type Response<Data> = {
  success: boolean;
  message: string;
  data: Data;
};

const request = async <ResponseData>(
  url: string,
  method: "GET" | "POST",
  data: Record<string, string> = {}
): Promise<Response<ResponseData>> => {
  try {
    const response = await axios.request({
      baseURL: process.env.REACT_APP_API_URL,
      url,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        message: "unknown error",
        data: {},
      }
    );
  }
};

export const fetchProducts = async () => {
  const response = await request<{ products: Product[] }>("product", "GET");
  return response.data.products || [];
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const response = await request<{ user: User; authToken: string }>(
    "user/register",
    "POST",
    {
      firstName,
      lastName,
      email,
      password,
    }
  );
  if (response.success) {
    storeAuthToken(response.data.authToken);
  }
  return response;
};

export const loginUser = async (email: string, password: string) => {
  const response = await request<{ user: User; authToken: string }>(
    "user/login",
    "POST",
    {
      email,
      password,
    }
  );
  if (response.success) {
    storeAuthToken(response.data.authToken);
  }
  return response;
};

export const verifyEmail = async (verificationCode: string) => {
  const response = await request<{ user: User; authToken: string }>(
    "user/verifyEmail",
    "POST",
    {
      verificationCode,
    }
  );
  if (response.success) {
    storeAuthToken(response.data.authToken);
  }
  return response;
};
