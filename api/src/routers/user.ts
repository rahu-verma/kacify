import { Router } from "express";
import { z } from "zod";
import { authHandler } from "../middlewares/auth";
import { validationHandler } from "../middlewares/validation";
import UserModel from "../models/user";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { encodeJwt } from "../utils/jwt";
import { sendForgotPasswordEmail } from "../utils/nodemailer";
import { UserRequest } from "../utils/types";
import {
  ForgotPasswordRequestBodySchema,
  LoginRequestBodySchema,
  RegisterRequestBodySchema,
} from "../utils/zod";

const UserRouter = Router();

UserRouter.post(
  "/register",
  validationHandler(RegisterRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as z.infer<
        typeof RegisterRequestBodySchema
      >;

      if (await UserModel.exists({ email })) {
        res.send({
          success: false,
          message: "Email already exists",
        });
        return;
      }

      await UserModel.create({ email, password: hashPassword(password) });
      res.send({
        success: true,
        message: "User registered successfully",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.post(
  "/login",
  validationHandler(LoginRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as z.infer<
        typeof LoginRequestBodySchema
      >;

      const user = await UserModel.findOne({ email });
      if (!user || !comparePassword(password, user.password)) {
        res.send({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      res.send({
        success: true,
        data: encodeJwt({ _id: user._id }),
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.get("/profile", authHandler, async (req: UserRequest, res, next) => {
  try {
    res.send({
      success: true,
      data: {
        _id: req.user?._id,
        email: req.user?.email,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

UserRouter.get(
  "/forgotPassword",
  validationHandler(ForgotPasswordRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email } = req.body as z.infer<
        typeof ForgotPasswordRequestBodySchema
      >;

      const user = await UserModel.findOne({ email });
      if (!user) {
        res.send({
          success: false,
          message: "User not found",
        });
        return;
      }

      user.forgotPasswordToken = Math.floor(Math.random() * 1000000);
      await user.save();

      await sendForgotPasswordEmail(user.email, user.forgotPasswordToken);
      res.json({
        success: true,
        message: "Password reset link sent to your email",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

export default UserRouter;
