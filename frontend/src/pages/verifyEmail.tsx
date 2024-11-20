import { useCallback, useState } from "react";
import { TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { verifyEmail } from "../utils/api";
import { storeAuthToken } from "../utils/authToken";

const VerifyEmail = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const [inputs, setInputs] = useState({
    email: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    verificationCode: "",
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
    const { email, verificationCode } = inputs;

    setPage("loader");
    verifyEmail(email, verificationCode).then((response) => {
      if (response.success) {
        toastSuccess(`email verified successfully`);
        storeAuthToken(response.data.authToken);
        setPage("profile");
      } else {
        toastError(`email verification failed: ${response.message}`);
      }
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

export default VerifyEmail;
