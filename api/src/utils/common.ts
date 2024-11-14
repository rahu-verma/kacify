import { ErrorRequestHandler, RequestHandler } from "express";

export const sanitizeInput = (input: string) => {
  return String(input)
    .trim()
    .replace(/^[&<>"']/g, "");
};

export const sanitizeInputs = (inputs: Record<string, string>) => {
  for (const key in inputs) {
    inputs[key] = sanitizeInput(inputs[key]);
  }
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "internal server error",
    data: {},
  });
};

export const versionRoute: RequestHandler = (req, res) => {
  res.json({
    success: true,
    message: "1.0.0",
    data: {},
  });
};

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
