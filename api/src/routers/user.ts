import { Router } from "express";
import { z } from "zod";
import { authVerification } from "../middlewares/auth";
import { requestBodyValidation } from "../middlewares/validation";
import User from "../models/user";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../utils/email";
import { encodeJwt } from "../utils/jwt";
import { createUser } from "../utils/mongoose";
import { UserRouterProfileSerializer } from "../utils/serializers";
import { RequestBodyValidatedRequest, UserRequest } from "../utils/types";
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
  VerifyEmailRequestBody,
} from "../utils/validations";

const UserRouter = Router();

UserRouter.post(
  "/register",
  requestBodyValidation(RegisterRequestBody),
  async (
    req: RequestBodyValidatedRequest<z.infer<typeof RegisterRequestBody>>,
    res,
    next
  ) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const foundEmail = await User.findOne({ email });
      if (foundEmail) {
        res.status(400).json({
          success: false,
          code: "emailAlreadyExists",
          message: "email already exists",
          data: {},
        });
        return;
      }

      const user = await createUser(firstName, lastName, email, password);

      await sendVerificationEmail(email, user.verificationCode);

      res.json({
        success: true,
        code: "userRegistered",
        message: "user registered successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.post(
  "/login",
  requestBodyValidation(LoginRequestBody),
  async (
    req: RequestBodyValidatedRequest<z.infer<typeof LoginRequestBody>>,
    res,
    next
  ) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "emailNotFound",
          message: "email not found",
          data: {},
        });
        return;
      }

      if (!user.emailVerified) {
        res.status(400).json({
          success: false,
          code: "emailNotVerified",
          message: "email not verified",
          data: {},
        });
        return;
      }

      if (!user.comparePassword(password)) {
        res.status(400).json({
          success: false,
          code: "passwordIncorrect",
          message: "password incorrect",
          data: {},
        });
        return;
      }

      const authToken = encodeJwt({ _id: user._id });

      res.json({
        success: true,
        code: "userLoggedIn",
        message: "user login successfully",
        data: {
          authToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.post(
  "/verifyEmail",
  requestBodyValidation(VerifyEmailRequestBody),
  async (
    req: RequestBodyValidatedRequest<z.infer<typeof VerifyEmailRequestBody>>,
    res,
    next
  ) => {
    try {
      let { email, verificationCode } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "emailNotFound",
          message: "email not found",
          data: {},
        });
        return;
      }

      if (verificationCode !== user.verificationCode) {
        res.status(400).json({
          success: false,
          code: "invalidVerificationCode",
          message: "invalid verification code",
          data: {},
        });
        return;
      }

      await user.verifyEmail();

      res.json({
        success: true,
        code: "emailVerified",
        message: "email verified successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.get(
  "/profile",
  authVerification,
  async (req: UserRequest, res, next) => {
    try {
      if (!req.user.emailVerified) {
        res.status(400).json({
          success: false,
          code: "emailNotVerified",
          message: "email not verified",
          data: {},
        });
        return;
      }

      res.json({
        success: true,
        message: "profile fetched successfully",
        data: UserRouterProfileSerializer(req.user),
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.post(
  "/forgotPassword",
  requestBodyValidation(ForgotPasswordRequestBody),
  async (
    req: RequestBodyValidatedRequest<z.infer<typeof ForgotPasswordRequestBody>>,
    res,
    next
  ) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "emailNotFound",
          message: "email not found",
          data: {},
        });
        return;
      }

      await user.setForgotPasswordVerificationCode();
      await sendForgotPasswordEmail(email, user.forgotPasswordVerificationCode);

      res.json({
        success: true,
        message: "forgot password verification code sent successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.post(
  "/changePassword",
  requestBodyValidation(ChangePasswordRequestBody),
  async (
    req: RequestBodyValidatedRequest<z.infer<typeof ChangePasswordRequestBody>>,
    res,
    next
  ) => {
    try {
      const { email, verificationCode, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "emailNotFound",
          message: "email not found",
          data: {},
        });
        return;
      }

      if (verificationCode !== user.forgotPasswordVerificationCode) {
        res.status(400).json({
          success: false,
          code: "invalidVerificationCode",
          message: "invalid verification code",
          data: {},
        });
        return;
      }

      if (user.comparePassword(password)) {
        res.status(400).json({
          success: false,
          code: "passwordSame",
          message: "password same as previous",
          data: {},
        });
        return;
      }

      await user.changePassword(password);

      res.json({
        success: true,
        message: "password changed successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
);

export default UserRouter;
