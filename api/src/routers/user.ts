import { Router } from "express";
import User from "../models/user";
import { encodeJwt, hashPassword, sanitizeInputs } from "../utils/common";
import { validateRegisterInputs } from "../utils/validations";

const UserRouter = Router();

UserRouter.post("/register", async (req, res, next) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    validateRegisterInputs(firstName, lastName, email, password);
    sanitizeInputs({ firstName, lastName, email, password });

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
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "email already exists",
        data: {},
      });
      return;
    }
    if (error.code === 400) {
      res.status(400).json({
        success: false,
        message: "validation failed",
        data: error.errors,
      });
      return;
    }
    next(error);
  }
});

export default UserRouter;
