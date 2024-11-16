import { Dispatch, SetStateAction } from "react";
import { Page } from "../context/user";

export const isStrongPassword = (password: string) => {
  // Password must be at least 8 characters long and contain at least one uppercase letter
  // one lowercase letter, one number, and one special character
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[~`!@#$%^&*\(\)_+-={\[\]|\\:;"'<,>\.?/}]/.test(password)
  );
};

export const isValidEmail = (email: string) => {
  return /^.+@.+\..+/.test(email);
};

export const storeAuthToken = (authToken: string) => {
  localStorage.setItem("kacifyAuthToken", authToken);
};

export const getAuthToken = () => {
  return localStorage.getItem("kacifyAuthToken");
};

export const getAccountPage = () => {
  return getAuthToken() ? "user" : "login";
};
