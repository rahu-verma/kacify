import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const ForgotPasswordRequestBody = z.object({
  email: z.string({ message: "Email is required" }),
});

export interface ForgotPasswordRequest extends Request {
  body: z.infer<typeof ForgotPasswordRequestBody>;
}

export const forgotPasswordValidation = (
  req: ForgotPasswordRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = ForgotPasswordRequestBody.safeParse(req.body);
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
