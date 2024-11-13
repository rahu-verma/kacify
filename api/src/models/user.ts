import { Schema, model } from "mongoose";
import { User } from "../types/user";

const schema = new Schema<User>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = model<User>("User", schema);

export default User;
