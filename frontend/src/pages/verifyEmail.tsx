import { useCallback, useState } from "react";
import { TextButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useLoaderContext } from "../context/loader";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { useUserContext } from "../context/user";
import { verifyEmail } from "../utils/api";

const VerifyEmail = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const { setShowLoader } = useLoaderContext();
  const { emailToVerify } = useUserContext();
  const [inputs, setInputs] = useState({
    verificationCode: "",
  });
  const [errors, setErrors] = useState({
    verificationCode: "",
  });
  const onChangeInput = useCallback(
    (k: "verificationCode", v: string) => {
      setInputs((p) => ({ ...p, [k]: v }));
      const errors_ = structuredClone(errors);
      errors_[k] = "";
      if (!v) {
        errors_[k] = `Field is required`;
      }
      if (k === "verificationCode" && isNaN(Number(v))) {
        errors_[k] = "Verification code must be a number";
      }
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { verificationCode } = inputs;

    setShowLoader(true);
    verifyEmail(emailToVerify, Number(verificationCode))
      .then((response) => {
        if (response.success) {
          toastSuccess(`email verified successfully`);
          setPage("login");
        } else {
          toastError(`email verification failed: ${response.message}`);
        }
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, [inputs]);
  return (
    <div className="flex justify-center">
      <div className="mt-6 flex flex-col gap-4 w-96">
        <span className="self-center py-2 text-xl uppercase font-bold">
          Verify Email
        </span>
        <div className="flex">
          <Input
            label="Verification Code"
            required
            value={inputs.verificationCode}
            onChange={(v) => onChangeInput("verificationCode", v)}
            error={errors.verificationCode}
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

export default VerifyEmail;
