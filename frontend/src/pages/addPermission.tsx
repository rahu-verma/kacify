import { useCallback, useState } from "react";
import { TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useLoaderContext } from "../context/loader";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { addPermission, loginUser } from "../utils/api";
import { storeAuthToken } from "../utils/authToken";

const AddPermissions = () => {
  const { toastSuccess, toastError } = useToastContext();
  const { setPage } = useNavigationContext();
  const { setShowLoader } = useLoaderContext();
  const [inputs, setInputs] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({
    name: "",
  });
  const onChangeInput = useCallback(
    (k: "name", v: string) => {
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
    const { name } = inputs;

    setShowLoader(true);
    addPermission(name)
      .then((response) => {
        if (response.success) {
          toastSuccess(`permission added successfully`);
          resetInputs();
        } else {
          toastError(`permission add failed: ${response.message}`);
        }
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, [inputs]);
  const resetInputs = useCallback(() => {
    setInputs({
      name: "",
    });
  }, []);
  return (
    <div className="flex justify-center">
      <div className="mt-6 flex flex-col gap-4 w-96">
        <span className="self-center py-2 text-3xl uppercase font-bold">
          Add Permissions
        </span>
        <div className="flex">
          <Input
            label="Name"
            required
            value={inputs.name}
            type="text"
            onChange={(v) => onChangeInput("name", v)}
            error={errors.name}
            name="name"
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

export default AddPermissions;
