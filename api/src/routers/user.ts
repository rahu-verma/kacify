import { compareSync } from "bcrypt";
import { Router } from "express";
import User from "../models/user";
import {
  encodeJwt,
  hashPassword,
  isStrongPassword,
  isValidEmail,
  sanitizeEmail,
  sanitizeInput,
} from "../utils/common";

const UserRouter = Router();

UserRouter.post("/register", async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;

  firstName = sanitizeInput(firstName);
  lastName = sanitizeInput(lastName);
  email = sanitizeEmail(email);

  const errors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!isValidEmail(email)) errors.email = "Email is invalid";
  if (!isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }

  if (Object.values(errors).some((v) => v.length)) {
    res.status(400).json({
      success: false,
      message: "registration validation failed",
      data: errors,
    });
  }

  const foundUser = await User.findOne({ email });
  if (foundUser) {
    res.status(400).json({
      success: false,
      message: "email already exists",
      data: {},
    });
    return;
  }

  password = hashPassword(password);
  const user = new User({ firstName, lastName, email, password });
  await user.save();
  const authToken = encodeJwt({ _id: user._id });

  res.json({
    success: true,
    message: "user registered successfully",
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      authToken,
    },
  });
});

UserRouter.post("/login", async (req, res, next) => {
  let { email, password } = req.body;

  email = sanitizeEmail(email);

  const errors = {
    email: "",
    password: "",
  };

  if (!isValidEmail(email)) errors.email = "Email is invalid";
  if (!password) errors.password = "Password is required";

  if (Object.values(errors).some((v) => v.length)) {
    res.status(400).json({
      success: false,
      message: "login validation failed",
      data: errors,
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      success: false,
      message: "email not found",
      data: {},
    });
    return;
  }

  if (!user.emailVerified) {
    res.status(400).json({
      success: false,
      message: "email not verified",
      data: {},
    });
    return;
  }

  if (!compareSync(password, user.password)) {
    res.status(400).json({
      success: false,
      message: "password incorrect",
      data: {},
    });
    return;
  }

  const authToken = encodeJwt({ _id: user._id });

  res.json({
    success: true,
    message: "user login successfully",
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      authToken,
    },
  });
});

UserRouter.post("/verifyEmail", async (req, res, next) => {
  let { email, verificationCode } = req.body;

  email = sanitizeEmail(email);
  verificationCode = sanitizeInput(verificationCode);

  const errors = {
    email: "",
    verificationCode: "",
  };
  if (!isValidEmail(email)) errors.email = "Email is invalid";
  if (!verificationCode)
    errors.verificationCode = "Verification code is required";
  if (Object.values(errors).some((v) => v.length)) {
    res.status(400).json({
      success: false,
      message: "login validation failed",
      data: errors,
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      success: false,
      message: "email not found",
      data: {},
    });
    return;
  }

  if (verificationCode !== user.verificationCode) {
    res.status(400).json({
      success: false,
      message: "invalid verification code",
      data: {},
    });
    return;
  }

  const authToken = encodeJwt({ _id: user._id });

  res.json({
    success: true,
    message: "user login successfully",
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      authToken,
    },
  });
});

export default UserRouter;
