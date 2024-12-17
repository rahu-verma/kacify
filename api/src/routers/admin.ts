import { Router } from "express";
import { z } from "zod";
import { validationHandler } from "../middlewares/validation";
import UserModel from "../models/user";
import { comparePassword } from "../utils/bcrypt";
import { encodeJwt } from "../utils/jwt";
import { LoginRequestBodySchema } from "../utils/zod";
import { adminAuthHandler, authHandler } from "../middlewares/auth";

const AdminRouter = Router();

AdminRouter.post(
  "/login",
  validationHandler(LoginRequestBodySchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as z.infer<
        typeof LoginRequestBodySchema
      >;

      const user = await UserModel.findOne({ email });
      if (
        !user ||
        !comparePassword(password, user.password) ||
        user.role !== "admin"
      ) {
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

AdminRouter.get(
  "/users",
  authHandler,
  adminAuthHandler,
  async (req, res, next) => {
    try {
      const users = await UserModel.find({ role: "user" });
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

export default AdminRouter;
