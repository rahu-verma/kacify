import { useCallback, useState } from "react";
import { TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { forgotPassword } from "../utils/api";
import { useLoaderContext } from "../context/loader";

const ForgotPassword = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const { setShowLoader } = useLoaderContext();
  const [inputs, setInputs] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
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
    const { email } = inputs;

    setShowLoader(true);
    forgotPassword(email)
      .then((response) => {
        if (response.success) {
          toastSuccess(`verification code sent to email successfully`);
          setPage("changePassword");
        } else {
          toastError(`forgot password failed: ${response.message}`);
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
          Forgot Password
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

export default ForgotPassword;
