import axios from "axios";
import { getAuthToken } from "./localStorage";

const request = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data: any = {}
): Promise<{
  success: boolean;
  data: any;
  message: string;
}> => {
  const response = await axios.request({
    method,
    baseURL: process.env.REACT_APP_API_BASE_URL,
    url,
    headers: {
      Authorization: getAuthToken(),
    },
    data,
  });
  return response.data;
};

export const fetchVendorProducts = async () => {
  return await request("GET", "/product/vendor");
};

export const fetchAllProducts = async () => {
  return await request("GET", "/product/list");
};

export const registerUser = async (
  email: string,
  password: string,
  role: string
) => {
  return await request("POST", "/user/register", {
    email,
    password,
    role,
  });
};

export const loginUser = async (
  email: string,
  password: string,
  role: string
) => {
  return await request("POST", "/user/login", {
    email,
    password,
    role,
  });
};

export const getUserProfile = async () => {
  return await request("GET", "/user/profile");
};

export const forgotPassword = async (email: string) => {
  return await request("POST", "/user/forgotPassword", {
    email,
  });
};

export const loginAdmin = async (email: string, password: string) => {
  return await request("POST", "/admin/login", {
    email,
    password,
  });
};

export const getUsers = async () => {
  return await request("GET", "/admin/users");
};

export const deleteUser = async (userId: string) => {
  return await request("DELETE", `/admin/user/${userId}`);
};

export const changePassword = async (password: string, token: string) => {
  return await request("POST", "/user/changePassword", {
    password,
    token,
  });
};

export const addProduct = async (
  name: string,
  price: number,
  image: string,
  description: string
) => {
  return await request("POST", "/product/", {
    name,
    price,
    image,
    description,
  });
};

export const deleteProduct = async (productId: string) => {
  return await request("DELETE", `/product/${productId}`);
};

export const editProduct = async (
  productId: string,
  name: string,
  price: number,
  image: string,
  description: string
) => {
  return await request("PUT", `/product/${productId}`, {
    name,
    price,
    image,
    description,
  });
};
