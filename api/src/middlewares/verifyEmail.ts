import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const VerifyEmailRequestBody = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  verificationCode: z.number({ message: "Verification code is required" }),
});

export interface VerifyEmailRequest extends Request {
  body: z.infer<typeof VerifyEmailRequestBody>;
}

export const verifyEmailValidation = (
  req: VerifyEmailRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = VerifyEmailRequestBody.safeParse(req.body);
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
