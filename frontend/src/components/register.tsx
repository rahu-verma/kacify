import { useCallback, useState } from "react";
import { useToastContext } from "../context/toast";
import { registerUser } from "../utils/api";
import { validateRegisterFields } from "../utils/validations";
import { TextButtonFilled } from "./buttons";
import Input from "./input";

const Register = () => {
  const { toastSuccess, toastError } = useToastContext();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: [],
    lastName: [],
    email: [],
    password: [],
    confirmPassword: [],
  });
  const onChangeInput = useCallback((k: string, v: string) => {
    setInputs((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: [] }));
  }, []);
  const onSubmit = useCallback(() => {
    try {
      validateRegisterFields(inputs, setErrors);

      const { firstName, lastName, email, password } = inputs;

      registerUser(firstName, lastName, email, password).then((response) => {
        if (response.success) {
          toastSuccess(
            `user registered successfully: ${response.data.user.email}`
          );
        } else {
          toastError(
            `user registration failed: ${response.message} - ${JSON.stringify(
              response.data
            )}`
          );
        }
      });
    } catch {}
  }, [inputs]);
  return (
    <div>
      <div className="mt-6 flex flex-col gap-4 w-96">
        <div className="flex gap-4">
          <Input
            label="First Name"
            required
            value={inputs.firstName}
            error={errors.firstName.join(", ")}
            onChange={(v) => onChangeInput("firstName", v)}
          />
          <Input
            label="Last Name"
            required
            value={inputs.lastName}
            onChange={(v) => onChangeInput("lastName", v)}
            error={errors.lastName.join(", ")}
          />
        </div>
        <div className="flex">
          <Input
            label="Email"
            required
            value={inputs.email}
            type="email"
            onChange={(v) => onChangeInput("email", v)}
            error={errors.email.join(", ")}
          />
        </div>
        <div className={"flex gap-4"}>
          <Input
            label="Password"
            required
            value={inputs.password}
            type="password"
            onChange={(v) => onChangeInput("password", v)}
            error={errors.password.join(", ")}
          />
          <Input
            label="Confirm Password"
            required
            value={inputs.confirmPassword}
            type="password"
            onChange={(v) => onChangeInput("confirmPassword", v)}
            error={errors.confirmPassword.join(", ")}
          />
        </div>
        <div className="mt-2">
          <TextButtonFilled text="Submit" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Register;
