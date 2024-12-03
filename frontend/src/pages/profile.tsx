import { useCallback, useEffect, useState } from "react";
import { isMobilePhone, isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useLoaderContext } from "../context/loader";
import { useToastContext } from "../context/toast";
import { useUserContext } from "../context/user";
import { editUser } from "../utils/api";

const User = () => {
  const { user } = useUserContext();
  const { toastSuccess, toastError } = useToastContext();
  const { setShowLoader } = useLoaderContext();
  const [inputs, setInputs] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const onChangeInput = useCallback(
    (
      k:
        | "firstName"
        | "lastName"
        | "email"
        | "password"
        | "confirmPassword"
        | "phoneNumber",
      v: string
    ) => {
      setInputs((p) => ({ ...p, [k]: v }));
      const errors_ = structuredClone(errors);
      errors_[k] = "";
      if (!v) {
        errors_[k] = `Field is required`;
      }
      if (k === "email" && !isEmail(v)) errors_[k] = "Email is invalid";
      if (k === "password" && !isStrongPassword(v)) {
        errors_[k] =
          "Password must be at least 8 characters long and " +
          "contain at least one uppercase letter, one lowercase letter, " +
          "one number, and one special character";
      }
      if (k === "confirmPassword" && v !== inputs.password) {
        errors_[k] = "Passwords do not match";
      }
      if (k === "phoneNumber" && !isMobilePhone(v, "en-IN")) {
        errors_[k] = "Phone number is invalid";
      }
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { firstName, lastName, email, password } = inputs;

    setShowLoader(true);
    editUser(firstName, lastName, email, password)
      .then((response) => {
        if (response.success) {
          toastSuccess(`user edit successfully`);
        } else {
          toastError(`user edit failed: ${response.message}`);
        }
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, [inputs]);
  useEffect(() => {
    setInputs({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  }, [user]);
  return (
    <div className="flex justify-center">
      <div className="mt-6 flex flex-col gap-4 w-96">
        <span className="self-center py-2 text-3xl uppercase font-bold">
          Profile
        </span>
        <div className="flex gap-4">
          <Input
            label="First Name"
            required
            value={inputs.firstName}
            error={errors.firstName}
            onChange={(v) => onChangeInput("firstName", v)}
            name="firstName"
          />
          <Input
            label="Last Name"
            required
            value={inputs.lastName}
            onChange={(v) => onChangeInput("lastName", v)}
            error={errors.lastName}
            name="lastName"
          />
        </div>
        <div className="flex">
          <Input
            label="Email"
            required
            value={inputs.email}
            type="email"
            onChange={(v) => onChangeInput("email", v)}
            error={errors.email}
            name="email"
          />
        </div>
        <div className={"flex gap-4"}>
          <Input
            label="Password"
            required
            value={inputs.password}
            type="password"
            onChange={(v) => onChangeInput("password", v)}
            error={errors.password}
            name="password"
          />
          <Input
            label="Confirm Password"
            required
            value={inputs.confirmPassword}
            type="password"
            onChange={(v) => onChangeInput("confirmPassword", v)}
            error={errors.confirmPassword}
            name="confirmPassword"
          />
        </div>
        <div className="mt-2">
          <TextButtonFilled
            text="Submit"
            onClick={onSubmit}
            disabled={
              Object.values(inputs).some((v) => !v) ||
              Object.values(errors).some((v) => v)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default User;
