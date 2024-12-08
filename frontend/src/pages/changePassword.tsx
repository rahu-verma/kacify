import { useCallback, useState } from "react";
import { isStrongPassword } from "validator";
import { TextButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useLoaderContext } from "../context/loader";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { useUserContext } from "../context/user";
import { changePassword } from "../utils/api";

const ChangePassword = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const { setShowLoader } = useLoaderContext();
  const [inputs, setInputs] = useState({
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });
  const { emailToVerify } = useUserContext();
  const onChangeInput = useCallback(
    (
      k: "email" | "verificationCode" | "password" | "confirmPassword",
      v: string
    ) => {
      setInputs((p) => ({ ...p, [k]: v }));
      const errors_ = structuredClone(errors);
      errors_[k] = "";
      if (!v) {
        errors_[k] = `Field is required`;
      }
      if (k === "password" && !isStrongPassword(v)) {
        errors_[k] =
          "Password must be at least 8 characters long and " +
          "contain at least one uppercase letter, one lowercase letter, " +
          "one number, and one special character";
      }
      if (k === "confirmPassword" && v !== inputs.password) {
        errors_[k] = "Passwords do not match";
      }
      if (k === "verificationCode" && isNaN(Number(v))) {
        errors_[k] = "Verification code must be a number";
      }
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { verificationCode, password } = inputs;
    setShowLoader(true);
    changePassword(emailToVerify, Number(verificationCode), password)
      .then((response) => {
        if (response.success) {
          toastSuccess(`password changed successfully`);
          setPage("login");
        } else {
          toastError(`password change failed: ${response.message}`);
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
          Verify Email
        </span>
        <div className="flex">
          <Input
            label="Verification Code"
            required
            value={inputs.verificationCode}
            onChange={(v) => onChangeInput("verificationCode", v)}
            error={errors.verificationCode}
            type="number"
            name="verificationCode"
          />
        </div>
        <div className="flex">
          <Input
            label="Password"
            required
            value={inputs.password}
            onChange={(v) => onChangeInput("password", v)}
            error={errors.password}
            type="password"
            name="password"
          />
        </div>
        <div className="flex">
          <Input
            label="Confirm Password"
            required
            value={inputs.confirmPassword}
            onChange={(v) => onChangeInput("confirmPassword", v)}
            error={errors.confirmPassword}
            type="password"
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
        <div className="self-center flex items-center gap-2">
          <span>Back to</span>
          <TextButton text="Login" onClick={() => setPage("login")} />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
