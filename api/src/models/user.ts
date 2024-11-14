import { Schema, model } from "mongoose";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const schema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<User>("User", schema);

User.syncIndexes();

export default User;
