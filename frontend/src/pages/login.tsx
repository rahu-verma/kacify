import { useCallback, useState } from "react";
import { TextButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { loginUser } from "../utils/api";
import { storeAuthToken } from "../utils/authToken";
import { useLoaderContext } from "../context/loader";

const Login = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const { setShowLoader } = useLoaderContext();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const onChangeInput = useCallback(
    (k: string, v: string) => {
      setInputs((p) => ({ ...p, [k]: v }));
      const errors_ = structuredClone(errors);
      errors_[k] = "";
      if (!v) {
        errors_[k] = `Field is required`;
      }
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { email, password } = inputs;

    setShowLoader(true);
    loginUser(email, password)
      .then((response) => {
        if (response.success) {
          toastSuccess(`user login successfully`);
          storeAuthToken(response.data.authToken);
          setPage("profile");
        } else {
          if (response.code === "email_not_verified") {
            setPage("verifyEmail");
          }
          toastError(`user login failed: ${response.message}`);
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
          Login
        </span>
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
        <div className={"flex"}>
          <Input
            label="Password"
            required
            value={inputs.password}
            type="password"
            onChange={(v) => onChangeInput("password", v)}
            error={errors.password}
            name="password"
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
          <span>Don't have an account?</span>
          <TextButton text="Register" onClick={() => setPage("register")} />
        </div>
        <div className="self-center flex items-center gap-2">
          <TextButton
            text="Forgot Password?"
            onClick={() => setPage("forgotPassword")}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
