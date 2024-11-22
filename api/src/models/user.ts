import { Schema, model, Document } from "mongoose";
import { hashPassword } from "../utils/bcrypt";
import isEmail from "validator/lib/isEmail";
import { isMobilePhone, isStrongPassword } from "validator";
import { compareSync } from "bcrypt";

export interface TUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  verificationCode: number | null;
  verifyEmail: () => Promise<void>;
  forgotPasswordVerificationCode: number | null;
  setForgotPasswordVerificationCode: () => Promise<void>;
  clearForgotPasswordVerificationCode: () => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  phoneNumber: string;
  comparePassword: (password: string) => boolean;
}

const schema = new Schema<TUser>({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isStrongPassword(v),
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: Number,
    default: null,
  },
  forgotPasswordVerificationCode: {
    type: Number,
    default: null,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isMobilePhone(v, "en-IN"),
    },
  },
});

schema.pre("save", function (next) {
  this.firstName = this.firstName.trim().replace(/[^A-Za-z0-9]/g, "");
  this.lastName = this.lastName.trim().replace(/[^A-Za-z0-9]/g, "");
  next();
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
  );
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

schema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};

const User = model<TUser>("User", schema);

User.syncIndexes();

export default User;
