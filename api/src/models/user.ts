import { Schema, model, Document } from "mongoose";

export interface TUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  verificationCode: string | null;
}

const schema = new Schema<TUser>({
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
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
});

const User = model<TUser>("User", schema);

User.syncIndexes();

export default User;
