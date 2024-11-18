import { useCallback, useState } from "react";
import Input from "../components/input";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { useUserContext } from "../context/user";
import { TextButtonFilled } from "../components/buttons";

const VerifyEmail = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setUser } = useUserContext();
  const { setPage } = useNavigationContext();
  const [inputs, setInputs] = useState({
    verificationCode: "",
  });
  const [errors, setErrors] = useState({
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
    const { verificationCode } = inputs;

    loginUser(email, password).then((response) => {
      if (response.success) {
        toastSuccess(`user login successfully`);
        setUser(response.data.user);
        setPage("user");
      } else {
        toastError(`user login failed: ${response.message}`);
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
