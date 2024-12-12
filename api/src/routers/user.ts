import { json, Router } from "express";
import { z } from "zod";
import { authVerification } from "../middlewares/auth";
import { errorCatcher } from "../middlewares/error";
import { serializeHandler } from "../middlewares/serializer";
import { requestBodyValidation } from "../middlewares/validation";
import User from "../models/user";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
  sendVerificationUpdateEmail,
} from "../utils/email";
import { encodeJwt } from "../utils/jwt";
import { createUser } from "../utils/mongoose";
import { response400, response401 } from "../utils/request";
import { RequestBodyValidatedRequest } from "../utils/types";
import {
  AuthTokenSerializerSchema,
  ChangePasswordRequestBody,
  EmptyResponseDataSchema,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
  UserEditRequestBody,
  UserSerializerSchema,
  VerifyEmailRequestBody,
} from "../utils/zod";

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
        response400(res, {
          message: "email already exists",
        });
        return;
      }

      const user = await createUser(firstName, lastName, email, password);

      if (user.verificationCode) {
        await sendVerificationEmail(email, user.verificationCode);
      }

      next();
    }
  ),
  serializeHandler(EmptyResponseDataSchema)
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
        response401(res);
        return;
      }

      if (!user.comparePassword(password)) {
        response401(res);
        return;
      }

      if (!user.emailVerified) {
        response400(res, {
          message: "email not verified",
        });
        return;
      }

      req.data = { authToken: encodeJwt({ _id: user._id }) };

      next();
    }
  ),
  serializeHandler(AuthTokenSerializerSchema)
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
        response400(res);
        return;
      }

      if (!(await user.verifyVerificationCode(verificationCode))) {
        response400(res);
        return;
      }

      next();
    }
  ),
  serializeHandler(EmptyResponseDataSchema)
);

UserRouter.get(
  "/profile",
  authVerification,
  errorCatcher(async (req, res, next) => {
    req.data = req.user;
    next();
  }),
  serializeHandler(UserSerializerSchema)
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
        response400(res);
        return;
      }

      await user.setForgotPasswordVerificationCode();
      if (user.forgotPasswordVerificationCode) {
        await sendForgotPasswordEmail(
          email,
          user.forgotPasswordVerificationCode
        );
      }

      next();
    }
  ),
  serializeHandler(EmptyResponseDataSchema)
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
        response400(res);
        return;
      }

      if (verificationCode !== user.forgotPasswordVerificationCode) {
        response400(res);
        return;
      }

      await user.clearForgotPasswordVerificationCode();
      await user.changePassword(password);

      next();
    }
  ),
  serializeHandler(EmptyResponseDataSchema)
);

UserRouter.put(
  "/edit",
  json({ limit: "10mb" }),
  authVerification,
  requestBodyValidation(UserEditRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<z.infer<typeof UserEditRequestBody>>,
      res,
      next
    ) => {
      const { firstName, lastName, email } = req.body;
      const password = req.body?.password;
      const image = req.body?.image;
      const user = req.user;

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email && user.email !== email) {
        await user.setVerificationCode();
        if (user.verificationCode) {
          await sendVerificationUpdateEmail(email, user.verificationCode);
        }
        user.email = email;
      }
      if (password) await user.changePassword(password);
      if (image) user.image = image;
      await user.save();

      req.data = user;

      next();
    }
  ),
  serializeHandler(UserSerializerSchema)
);

export default UserRouter;
