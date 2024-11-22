import { NextFunction, Request, Response } from "express";
import { isStrongPassword } from "validator";
import { z } from "zod";

const ChangePasswordRequestBody = z.object({
  email: z.string({ message: "Email is required" }),
  verificationCode: z.number({ message: "Verification code is required" }),
  password: z.string().refine(isStrongPassword, {
    message:
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export interface ChangePasswordRequest extends Request {
  body: z.infer<typeof ChangePasswordRequestBody>;
}

export const changePasswordValidation = (
  req: ChangePasswordRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = ChangePasswordRequestBody.safeParse(req.body);
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
