import { Router } from "express";
import { authVerification } from "../middlewares/auth";
import User from "../models/user";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../utils/email";
import { encodeJwt } from "../utils/jwt";
import { createUser } from "../utils/mongoose";
import { UserRouterProfileSerializer } from "../utils/serializers";
import { UserRequest } from "../utils/types";
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
  VerifyEmailRequestBody,
} from "../utils/validations";

const UserRouter = Router();

UserRouter.post("/register", async (req, res, next) => {
  try {
    const results = RegisterRequestBody.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        success: false,
        message: "validation failed",
        data: results.error.format(),
        code: "validationFailed",
      });
      return;
    }

    const { firstName, lastName, email, password } = results.data;

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
});

UserRouter.post("/login", async (req, res, next) => {
  try {
    const results = LoginRequestBody.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        success: false,
        message: "validation failed",
        data: results.error.format(),
        code: "validationFailed",
      });
      return;
    }

    const { email, password } = results.data;

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
});

UserRouter.post("/verifyEmail", async (req, res, next) => {
  try {
    const results = VerifyEmailRequestBody.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        success: false,
        message: "validation failed",
        data: results.error.format(),
        code: "validationFailed",
      });
      return;
    }

    let { email, verificationCode } = results.data;

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
});

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

UserRouter.post("/forgotPassword", async (req, res, next) => {
  try {
    const results = ForgotPasswordRequestBody.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        success: false,
        message: "validation failed",
        data: results.error.format(),
        code: "validationFailed",
      });
      return;
    }

    const { email } = results.data;

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
});

UserRouter.post("/changePassword", async (req, res, next) => {
  try {
    const results = ChangePasswordRequestBody.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        success: false,
        message: "validation failed",
        data: results.error.format(),
        code: "validationFailed",
      });
      return;
    }

    const { email, verificationCode, password } = results.data;

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
});

export default UserRouter;
