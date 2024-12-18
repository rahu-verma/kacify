import { isStrongPassword } from "validator";
import { z } from "zod";

export const RegisterRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
  role: z
    .string()
    .min(1)
    .refine((role) => ["user", "vendor"].includes(role), {
      message: "Role must be either 'user' or 'vendor'",
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

export const ChangePasswordRequestBodySchema = z.object({
  password: z.string().refine(isStrongPassword, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
  token: z.string().min(1),
});

export const AddProductRequestBodySchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  price: z.number().min(1),
  description: z.string().min(1),
});
