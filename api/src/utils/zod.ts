import { Types } from "mongoose";
import { isStrongPassword } from "validator";
import { z } from "zod";

export const ChangePasswordRequestBody = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  verificationCode: z
    .number()
    .int({ message: "Verification code is required" }),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export const ForgotPasswordRequestBody = z.object({
  email: z.string().min(1, { message: "Email is required" }),
});

export const LoginRequestBody = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
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
  verificationCode: z
    .number()
    .int({ message: "Verification code is required" }),
});

export const PermissionAddRequestBody = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const UserEditRequestBody = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .transform((v) => v.trim().replace(/[^A-Za-z0-9]/g, ""))
    .optional(),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .transform((v) => v.trim().replace(/[^A-Za-z0-9]/g, ""))
    .optional(),
  email: z.string().email({ message: "Email is invalid" }).optional(),
  password: z
    .string()
    .refine(isStrongPassword, {
      message:
        "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    .optional(),
  image: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        return /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
          v
        );
      },
      { message: "Image is invalid" }
    ),
});

export const ProductRouterSerializerSchema = z.object({
  products: z.array(
    z.object({
      _id: z.custom<Types.ObjectId>(),
      name: z.string(),
      price: z.number(),
      image: z.string(),
    })
  ),
});

export const AuthTokenSerializerSchema = z.object({
  authToken: z.string(),
});

export const UserSerializerSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
});

export const EmptyResponseDataSchema = z.object({});
