import { NextFunction, Request, RequestHandler, Response } from "express";
import { isStrongPassword } from "validator";
import { z } from "zod";

const RegisterRequestBody = z.object({
  firstName: z.string({ message: "First name is required" }),
  lastName: z.string({ message: "Last name is required" }),
  email: z.string().email({ message: "Email is invalid" }),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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
