import { useCallback, useState } from "react";
import { useToastContext } from "../context/toast";
import { registerUser } from "../utils/api";
import { validateRegisterFields } from "../utils/validations";
import { TextButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useUserContext } from "../context/user";
import { useNavigationContext } from "../context/navigation";

const Login = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setUser } = useUserContext();
  const { setPage } = useNavigationContext();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });
  const onChangeInput = useCallback((k: string, v: string) => {
    setInputs((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: [] }));
  }, []);
  const onSubmit = useCallback(() => {
    //   try {
    //     validateRegisterFields(inputs, setErrors);
    //     const { email, password } = inputs;
    //     registerUser(firstName, lastName, email, password).then((response) => {
    //       if (response.success) {
    //         toastSuccess(`user registered successfully`);
    //         setUser(response.data.user);
    //         setPage("user");
    //       } else {
    //         toastError(`user registration failed: ${response.message}`);
    //       }
    //     });
    //   } catch {}
  }, [inputs]);
  return (
    <div className="flex justify-center">
      <div className="mt-6 flex flex-col gap-4 w-96">
        <span className="self-center py-2 text-3xl uppercase font-bold">
          Login
        </span>
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
        <div className={"flex"}>
          <Input
            label="Password"
            required
            value={inputs.password}
            type="password"
            onChange={(v) => onChangeInput("password", v)}
            error={errors.password.join(", ")}
          />
        </div>
        <div className="mt-2">
          <TextButtonFilled text="Submit" onClick={onSubmit} />
        </div>
        <div className="self-center flex items-center gap-2">
          <span>Don't have an account?</span>
          <TextButton text="Register" onClick={() => setPage("register")} />
        </div>
      </div>
    </div>
  );
};

export default Login;
