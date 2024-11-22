import { NextFunction, Request, Response } from "express";
import { isMobilePhone, isStrongPassword } from "validator";
import { z } from "zod";

const RegisterRequestBody = z.object({
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
  phoneNumber: z.string().refine((v) => isMobilePhone(v, "en-IN"), {
    message: "Phone number is invalid",
  }),
});

export interface RegisterRequest extends Request {
  body: z.infer<typeof RegisterRequestBody>;
}

export const registerValidation = (
  req: RegisterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = RegisterRequestBody.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        success: false,
        code: "validation_failed",
        message: "validation failed",
        data: results.error.format(),
      });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};
