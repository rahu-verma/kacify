import { isStrongPassword } from "validator";
import { z } from "zod";

export const ChangePasswordRequestBody = z.object({
  email: z.string({ message: "Email is required" }),
  verificationCode: z.number({ message: "Verification code is required" }),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export const ForgotPasswordRequestBody = z.object({
  email: z.string({ message: "Email is required" }),
});

export const LoginRequestBody = z.object({
  email: z.string({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }),
});

export const RegisterRequestBody = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .transform((v) => v.trim().replace(/[^A-Za-z0-9]/g, "")),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .transform((v) => v.trim().replace(/[^A-Za-z0-9]/g, "")),
  email: z.string().email({ message: "Email is invalid" }),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export const VerifyEmailRequestBody = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  verificationCode: z.number({ message: "Verification code is required" }),
});

export const PermissionAddRequestBody = z.object({
  name: z.string({ message: "Name is required" }),
});
