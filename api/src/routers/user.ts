import { Router } from "express";
import { z } from "zod";
import { authHandler, roleHandler } from "../middlewares/auth";
import { requestBodyValidationHandler } from "../middlewares/validation";
import UserModel from "../models/user";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { encodeJwt } from "../utils/jwt";
import { sendForgotPasswordEmail } from "../utils/nodemailer";
import { UserRequest } from "../utils/types";
import {
  ChangePasswordRequestBodySchema,
  ForgotPasswordRequestBodySchema,
  LoginRequestBodySchema,
  RegisterRequestBodySchema,
} from "../utils/zod";

const UserRouter = Router();

UserRouter.post(
  "/register",
  requestBodyValidationHandler(RegisterRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email, password, role } = req.body as z.infer<
        typeof RegisterRequestBodySchema
      >;

      if (await UserModel.exists({ email })) {
        res.send({
          success: false,
          message: "Email already exists",
        });
        return;
      }

      await UserModel.create({
        email,
        password: hashPassword(password),
        role,
      });
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
  requestBodyValidationHandler(LoginRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as z.infer<
        typeof LoginRequestBodySchema
      >;

      const user = await UserModel.findOne({ email });
      if (!user || !comparePassword(password, user.password)) {
        res.send({
          success: false,
          message: "unauthorized",
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

UserRouter.post(
  "/forgotPassword",
  requestBodyValidationHandler(ForgotPasswordRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email } = req.body as z.infer<
        typeof ForgotPasswordRequestBodySchema
      >;

      const user = await UserModel.findOne({ email });
      if (!user || user.role !== "user") {
        res.send({
          success: false,
          message: "unauthorized",
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

UserRouter.post(
  "/changePassword",
  requestBodyValidationHandler(ChangePasswordRequestBodySchema),
  async (req, res, next) => {
    try {
      const { password, token } = req.body as z.infer<
        typeof ChangePasswordRequestBodySchema
      >;

      const [email, forgotPasswordToken] = token.split("|");
      const user = await UserModel.findOne({ email });
      if (
        !user ||
        user.forgotPasswordToken !== parseInt(forgotPasswordToken) ||
        user.role !== "user"
      ) {
        res.send({
          success: false,
          message: "unauthorized",
        });
        return;
      }

      await user.updateOne({ password: hashPassword(password) });

      res.send({
        success: true,
        message: "Password changed successfully",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.get(
  "/users",
  authHandler,
  roleHandler(["admin"]),
  async (req, res, next) => {
    try {
      const users = await UserModel.find({}).select("_id email");
      res.send({
        success: true,
        data: users,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.delete(
  "/user/:userId",
  authHandler,
  roleHandler(["admin"]),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await UserModel.findById(userId);
      if (!user) {
        res.send({
          success: false,
          message: "User not found",
        });
        return;
      }
      await user.deleteOne();
      res.send({
        success: true,
        message: "User deleted",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

export default UserRouter;
