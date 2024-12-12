import { useCallback, useEffect, useRef, useState } from "react";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { ImageButton, TextButtonFilled } from "../components/buttons";
import Input from "../components/input";
import { useLoaderContext } from "../context/loader";
import { useNavigationContext } from "../context/navigation";
import { useToastContext } from "../context/toast";
import { useUserContext } from "../context/user";
import { editUser } from "../utils/api";

const requiredInputs = ["firstName", "lastName", "email"];

const User = () => {
  const { user, setEmailToVerify, refreshUser } = useUserContext();
  const { toastSuccess, toastError } = useToastContext();
  const { setShowLoader } = useLoaderContext();
  const { setPage } = useNavigationContext();
  const [inputs, setInputs] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    image: user?.image || "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const onChangeInput = useCallback(
    (
      k:
        | "firstName"
        | "lastName"
        | "email"
        | "password"
        | "confirmPassword"
        | "phoneNumber"
        | "image",
      v: string
    ) => {
      setInputs((p) => ({ ...p, [k]: v }));
      const errors_ = structuredClone(errors);
      errors_[k] = "";
      if (!v && requiredInputs.includes(k)) {
        errors_[k] = `Field is required`;
      }
      if (k === "email" && !isEmail(v)) errors_[k] = "Email is invalid";
      if (k === "password" && !isStrongPassword(v)) {
        errors_["password"] =
          "Password must be at least 8 characters long and " +
          "contain at least one uppercase letter, one lowercase letter, " +
          "one number, and one special character";
      }
      if (k === "confirmPassword" && v !== inputs.password) {
        errors_["confirmPassword"] = "Passwords do not match";
      }
      setErrors(errors_);
    },
    [errors, inputs]
  );
  const onSubmit = useCallback(() => {
    const { firstName, lastName, email, password, image } = inputs;

    setShowLoader(true);
    editUser(firstName, lastName, email, password, image)
      .then((response) => {
        if (response.success) {
          toastSuccess(`user edit successfully`);
          if (response.message === "email changed") {
            setEmailToVerify(email);
            setPage("verifyEmail");
          } else {
            refreshUser();
          }
        } else {
          toastError(`user edit failed: ${response.message}`);
        }
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, [inputs]);
  useEffect(() => {
    setInputs({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      image: user?.image || "",
    });
  }, [user]);
  const profileImageRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex justify-center">
      <div className="mt-6 flex flex-col gap-4 w-96">
        <span className="self-center py-2 text-3xl uppercase font-bold">
          Profile
        </span>
        <div className="flex justify-center">
          <ImageButton
            src={inputs?.image || "/avatar.svg"}
            onClick={() => {
              profileImageRef.current?.click();
            }}
          />
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.readAsDataURL(file as Blob);
              reader.onload = (e) => {
                onChangeInput("image", e.target.result as string);
              };
            }}
            ref={profileImageRef}
          />
        </div>
        <div className="flex gap-4">
          <Input
            label="First Name"
            required
            value={inputs.firstName}
            error={errors.firstName}
            onChange={(v) => onChangeInput("firstName", v)}
            name="firstName"
          />
          <Input
            label="Last Name"
            required
            value={inputs.lastName}
            onChange={(v) => onChangeInput("lastName", v)}
            error={errors.lastName}
            name="lastName"
          />
        </div>
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
        <div className={"flex gap-4"}>
          <Input
            label="Password"
            value={inputs.password}
            type="password"
            onChange={(v) => onChangeInput("password", v)}
            error={errors.password}
            name="password"
          />
          <Input
            label="Confirm Password"
            value={inputs.confirmPassword}
            type="password"
            onChange={(v) => onChangeInput("confirmPassword", v)}
            error={errors.confirmPassword}
            name="confirmPassword"
          />
        </div>
        <div className="mt-2">
          <TextButtonFilled
            text="Submit"
            onClick={onSubmit}
            disabled={
              Object.entries(inputs)
                .filter(([k, v]) => requiredInputs.includes(k))
                .some((v) => !v) ||
              Object.values(errors).some((v) => v) ||
              inputs.password !== inputs.confirmPassword
            }
          />
        </div>
      </div>
    </div>
  );
};

export default User;
