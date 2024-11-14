import { isStrongPassword, isValidEmail } from "./common";

export const validateRegisterInputs = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  let errors = {
    firstName: [],
    lastName: [],
    email: [],
    password: [],
  }
  if (!firstName) errors.firstName.push("First name is required");
  if (!lastName) errors.lastName.push("Last name is required");
  if (!email) errors.email.push("Email is required");
  if (!password) errors.password.push("Password is required");
  if (!isValidEmail(email)) errors.email.push("Email is invalid");
  if (!isStrongPassword(password))
    errors.password.push(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );

  if (Object.values(errors).some((v) => v.length)){
    throw { code: 400, errors }
  }
};
