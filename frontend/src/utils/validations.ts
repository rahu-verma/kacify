import { Dispatch, SetStateAction } from "react";
import { isStrongPassword, isValidEmail } from "./common";

export const validateRegisterFields = (
  inputs: Record<string, string>,
  setErrors: Dispatch<SetStateAction<Record<string, string[]>>>
) => {
  const { firstName, lastName, email, password, confirmPassword } = inputs;

  const errors = {
    firstName: [],
    lastName: [],
    email: [],
    password: [],
    confirmPassword: [],
  };

  if (!firstName) errors.firstName.push("First name is required");
  if (!lastName) errors.lastName.push("Last name is required");
  if (!email) errors.email.push("Email is required");
  if (!password) errors.password.push("Password is required");

  if (!isValidEmail(email)) errors.email.push("Email is invalid");

  if (!isStrongPassword(password)) {
    errors.password.push(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }

  if (password !== confirmPassword) {
    errors.confirmPassword.push("Passwords do not match");
  }

  setErrors(errors);

  if(Object.values(errors).some((e) => e.length > 0)) {
    throw { code: 400, errors };
  }
};
