import { isStrongPassword } from "validator";
import { z } from "zod";

export const RegisterRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export const LoginRequestBodySchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const ForgotPasswordRequestBodySchema = z.object({
  email: z.string().email(),
});

export const AdminRegisterRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
  adminRegisterToken: z.string().min(1),
});
