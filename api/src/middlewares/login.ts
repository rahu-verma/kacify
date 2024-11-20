import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const LoginRequestBody = z.object({
  email: z.string({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }),
});

export interface LoginRequest extends Request {
  body: z.infer<typeof LoginRequestBody>;
}

export const loginValidation = (
  req: LoginRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = LoginRequestBody.safeParse(req.body);
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
