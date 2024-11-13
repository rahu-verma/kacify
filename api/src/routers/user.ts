import { Router } from "express";
import User from "../models/user";

const UserRouter = Router();

UserRouter.post("/register", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  firstName = String(firstName);
  lastName = String(lastName);
  email = String(email);
  password = String(password);

  const user = new User({ firstName, lastName, email, password });
  await user.save();

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
    },
  });
});

export default UserRouter;
