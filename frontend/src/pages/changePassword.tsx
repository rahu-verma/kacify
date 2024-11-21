import { useCallback, useState } from "react";
import { TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { changePassword, verifyEmail } from "../utils/api";
import { storeAuthToken } from "../utils/authToken";
import { useLoaderContext } from "../context/loader";
import { isStrongPassword } from "validator";

const ChangePassword = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const { setShowLoader } = useLoaderContext();
  const [inputs, setInputs] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });
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
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { email, verificationCode, password } = inputs;
    setShowLoader(true);
    changePassword(email, verificationCode, password)
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
            label="Email"
            required
            value={inputs.email}
            onChange={(v) => onChangeInput("email", v)}
            error={errors.email}
          />
        </div>
        <div className="flex">
          <Input
            label="Verification Code"
            required
            value={inputs.verificationCode}
            onChange={(v) => onChangeInput("verificationCode", v)}
            error={errors.verificationCode}
            type="number"
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

export default ChangePassword;
