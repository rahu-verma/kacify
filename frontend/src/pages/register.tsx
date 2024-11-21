import { useCallback, useState } from "react";
import isEmail from "validator/lib/isEmail";
import { TextButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { useUserContext } from "../context/user";
import { registerUser } from "../utils/api";
import { isStrongPassword } from "validator";
import { storeAuthToken } from "../utils/authToken";
import { useLoaderContext } from "../context/loader";

const Register = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setShowLoader } = useLoaderContext();
  const { setPage } = useNavigationContext();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const onChangeInput = useCallback(
    (k: string, v: string) => {
      setInputs((p) => ({ ...p, [k]: v }));
      const errors_ = structuredClone(errors);
      errors_[k] = "";
      if (!v && !["email", "password", "confirmPassword"].includes(k)) {
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
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { firstName, lastName, email, password } = inputs;

    setShowLoader(true);
    registerUser(firstName, lastName, email, password)
      .then((response) => {
        if (response.success) {
          toastSuccess(`user registered successfully`);
          storeAuthToken(response.data.authToken);
          setPage("verifyEmail");
        } else {
          toastError(`user registration failed: ${response.message}`);
        }
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, [inputs]);
  return (
    <div className="flex justify-center">
      <div className="mt-6 flex flex-col gap-4 w-96">
        <span className="self-center py-2 text-3xl uppercase font-bold">
          Register
        </span>
        <div className="flex gap-4">
          <Input
            label="First Name"
            required
            value={inputs.firstName}
            error={errors.firstName}
            onChange={(v) => onChangeInput("firstName", v)}
          />
          <Input
            label="Last Name"
            required
            value={inputs.lastName}
            onChange={(v) => onChangeInput("lastName", v)}
            error={errors.lastName}
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
          />
          <Input
            label="Confirm Password"
            required
            value={inputs.confirmPassword}
            type="password"
            onChange={(v) => onChangeInput("confirmPassword", v)}
            error={errors.confirmPassword}
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
        <div className="self-center flex items-center gap-2">
          <span>Already have an account?</span>
          <TextButton text="Login" onClick={() => setPage("login")} />
        </div>
      </div>
    </div>
  );
};

export default Register;
