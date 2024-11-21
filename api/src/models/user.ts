import { Schema, model, Document } from "mongoose";
import { hashPassword } from "../utils/bcrypt";

export interface TUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  verificationCode: string | null;
  verifyEmail: () => Promise<void>;
  forgotPasswordVerificationCode: string | null;
  setForgotPasswordVerificationCode: () => Promise<void>;
  clearForgotPasswordVerificationCode: () => Promise<void>;
  changePassword: (password: string) => Promise<void>;
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
  forgotPasswordVerificationCode: {
    type: String,
    default: null,
  },
});

schema.methods.toJSON = function () {
  return {
    id: this._id,
    fullName: `${this.firstName} ${this.lastName}`,
    email: this.email,
  };
};

schema.methods.verifyEmail = async function () {
  this.emailVerified = true;
  this.verificationCode = null;
  await this.save();
};

schema.methods.setForgotPasswordVerificationCode = async function () {
  this.forgotPasswordVerificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  await this.save();
};

schema.methods.clearForgotPasswordVerificationCode = async function () {
  this.forgotPasswordVerificationCode = null;
  await this.save();
};

schema.methods.changePassword = async function (password: string) {
  this.password = hashPassword(password);
  await this.save();
};

const User = model<TUser>("User", schema);

User.syncIndexes();

export default User;
