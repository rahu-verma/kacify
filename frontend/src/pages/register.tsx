import { useCallback, useState } from "react";
import { useToastContext } from "../context/toast";
import { registerUser } from "../utils/api";
import { validateRegisterFields } from "../utils/validations";
import { TextButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useUserContext } from "../context/user";
import { useNavigationContext } from "../context/navigation";

const Register = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setUser } = useUserContext();
  const { setPage } = useNavigationContext();
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
          toastSuccess(`user registered successfully`);
          setUser(response.data.user);
          setPage("user");
        } else {
          toastError(`user registration failed: ${response.message}`);
        }
      });
    } catch {}
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
        <div className="self-center flex items-center gap-2">
          <span>Already have an account?</span>
          <TextButton text="Login" onClick={() => setPage("login")}/>
        </div>
      </div>
    </div>
  );
};

export default Register;
