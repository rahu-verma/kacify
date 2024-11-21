import { compareSync } from "bcrypt";
import { Router } from "express";
import { authVerification } from "../middlewares/auth";
import User from "../models/user";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../utils/email";
import { encodeJwt } from "../utils/jwt";
import { createUser } from "../utils/mongoose";

import { z } from "zod";
import { RegisterRequest, registerValidation } from "../middlewares/register";
import { LoginRequest, loginValidation } from "../middlewares/login";
import {
  VerifyEmailRequest,
  verifyEmailValidation,
} from "../middlewares/verifyEmail";
import { UserRequest } from "../utils/types";
import {
  ForgotPasswordRequest,
  forgotPasswordValidation,
} from "../middlewares/forgotPassword";
import {
  ChangePasswordRequest,
  changePasswordValidation,
} from "../middlewares/changePassword";

const UserRouter = Router();

UserRouter.post(
  "/register",
  registerValidation,
  async (req: RegisterRequest, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const foundUser = await User.findOne({ email });
      if (foundUser) {
        res.status(400).json({
          success: false,
          code: "email_already_exists",
          message: "email already exists",
          data: {},
        });
        return;
      }

      const user = await createUser(firstName, lastName, email, password);
      await sendVerificationEmail(email, user.verificationCode);

      const authToken = encodeJwt({ _id: user._id });

      res.json({
        success: true,
        code: "user_registered",
        message: "user registered successfully",
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
  "/login",
  loginValidation,
  async (req: LoginRequest, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "email_not_found",
          message: "email not found",
          data: {},
        });
        return;
      }

      if (!user.emailVerified) {
        res.status(400).json({
          success: false,
          code: "email_not_verified",
          message: "email not verified",
          data: {},
        });
        return;
      }

      if (!compareSync(password, user.password)) {
        res.status(400).json({
          success: false,
          code: "password_incorrect",
          message: "password incorrect",
          data: {},
        });
        return;
      }

      const authToken = encodeJwt({ _id: user._id });

      res.json({
        success: true,
        code: "user_logged_in",
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
  verifyEmailValidation,
  async (req: VerifyEmailRequest, res, next) => {
    try {
      let { email, verificationCode } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "email_not_found",
          message: "email not found",
          data: {},
        });
        return;
      }

      if (verificationCode !== user.verificationCode) {
        res.status(400).json({
          success: false,
          code: "invalid_verification_code",
          message: "invalid verification code",
          data: {},
        });
        return;
      }

      await user.verifyEmail();
      const authToken = encodeJwt({ _id: user._id });

      res.json({
        success: true,
        code: "email_verified",
        message: "email verified successfully",
        data: {
          authToken,
        },
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
          code: "email_not_verified",
          message: "email not verified",
          data: {},
        });
        return;
      }

      res.json({
        success: true,
        message: "profile fetched successfully",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.post(
  "/forgotPassword",
  forgotPasswordValidation,
  async (req: ForgotPasswordRequest, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "email_not_found",
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
  changePasswordValidation,
  async (req: ChangePasswordRequest, res, next) => {
    try {
      const { email, verificationCode, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          code: "email_not_found",
          message: "email not found",
          data: {},
        });
        return;
      }

      if (verificationCode !== user.forgotPasswordVerificationCode) {
        res.status(400).json({
          success: false,
          code: "invalid_verification_code",
          message: "invalid verification code",
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
