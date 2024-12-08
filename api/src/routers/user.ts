import { json, Router } from "express";
import { z } from "zod";
import { authVerification } from "../middlewares/auth";
import { requestBodyValidation } from "../middlewares/validation";
import User from "../models/user";
import { sendForgotPasswordEmail, sendVerificationEmail } from "../utils/email";
import { encodeJwt } from "../utils/jwt";
import { createUser } from "../utils/mongoose";
import { UserRouterProfileSerializer } from "../utils/serializers";
import {
  RequestBodyValidatedRequest,
  RequestBodyValidatedUserRequest,
  UserRequest,
} from "../utils/types";
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
  UserEditRequestBody,
  VerifyEmailRequestBody,
} from "../utils/zod";
import { errorCatcher } from "../middlewares/error";

const UserRouter = Router();

UserRouter.post(
  "/register",
  requestBodyValidation(RegisterRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<z.infer<typeof RegisterRequestBody>>,
      res,
      next
    ) => {
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
    }
  )
);

UserRouter.post(
  "/login",
  requestBodyValidation(LoginRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<z.infer<typeof LoginRequestBody>>,
      res,
      next
    ) => {
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
    }
  )
);

UserRouter.post(
  "/verifyEmail",
  requestBodyValidation(VerifyEmailRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<z.infer<typeof VerifyEmailRequestBody>>,
      res,
      next
    ) => {
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
    }
  )
);

UserRouter.get(
  "/profile",
  authVerification,
  errorCatcher(async (req: UserRequest, res, next) => {
    res.json({
      success: true,
      message: "profile fetched successfully",
      data: UserRouterProfileSerializer(req.user),
      code: "profileFetched",
    });
  })
);

UserRouter.post(
  "/forgotPassword",
  requestBodyValidation(ForgotPasswordRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<
        z.infer<typeof ForgotPasswordRequestBody>
      >,
      res,
      next
    ) => {
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
    }
  )
);

UserRouter.post(
  "/changePassword",
  requestBodyValidation(ChangePasswordRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<
        z.infer<typeof ChangePasswordRequestBody>
      >,
      res,
      next
    ) => {
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
    }
  )
);

UserRouter.put(
  "/edit",
  json({ limit: "10mb" }),
  authVerification,
  requestBodyValidation(UserEditRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedUserRequest<z.infer<typeof UserEditRequestBody>>,
      res,
      next
    ) => {
      const { firstName, lastName, email } = req.body;
      const password = req.body?.password;
      const image = req.body?.image;
      const user = req.user;

      let responseCode = "userEdited";

      user.firstName = firstName;
      user.lastName = lastName;
      if (user.email !== email) {
        await user.setVerificationCode();
        await sendVerificationEmail(email, user.verificationCode);
        responseCode = "emailChanged";
      }
      user.email = email;
      if (password) await user.changePassword(password);
      if (image) user.image = image;
      await user.save();

      res.json({
        success: true,
        message: "user edited successfully",
        data: UserRouterProfileSerializer(user),
        code: responseCode,
      });
    }
  )
);

export default UserRouter;
