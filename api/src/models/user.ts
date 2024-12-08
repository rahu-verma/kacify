import { compareSync } from "bcrypt";
import { Document, Schema, Types, model } from "mongoose";
import { isAlphanumeric, isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { hashPassword } from "../utils/bcrypt";
import { PermissionModelName } from "./permission";

export type Role = "admin" | "user" | "superuser";

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
  comparePassword: (password: string) => boolean;
  image: string;
  role: Role;
  permissions: string[];
  setVerificationCode: () => Promise<void>;
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
  image: {
    type: String,
    default: null,
    validate: {
      validator: (v) =>
        /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
          v
        ) ||
        v.length === 0 ||
        v === null,
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "superuser"],
    default: "user",
  },
  permissions: [
    {
      type: Types.ObjectId,
      ref: PermissionModelName,
    },
  ],
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

schema.methods.setVerificationCode = async function () {
  this.verificationCode = Math.floor(100000 + Math.random() * 900000);
  this.emailVerified = false;
  await this.save();
};

export const UserModelName = "User";

const User = model<TUser>(UserModelName, schema);

User.syncIndexes();

export default User;
