import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { IconButton } from "./buttons";
import { useState } from "react";

const Input = ({
  label,
  value,
  onChange,
  required,
  type: typeProp,
  error,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: "number" | "password" | "text" | "email";
  error?: string;
  onBlur?: () => void;
}) => {
  const [type, setType] = useState(typeProp);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col w-full">
      <span>
        {label}
        {required && "*"}
      </span>
      <div className="flex items-center relative">
        <input
          type={type}
          className="border-2 border-primary-light rounded-md h-10 w-full px-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        {typeProp === "password" &&
          (showPassword ? (
            <IconButton
              Icon={IoEye}
              onClick={() => {
                setShowPassword(false);
                setType("password");
              }}
              className="absolute right-2"
            />
          ) : (
            <IconButton
              Icon={IoEyeOff}
              onClick={() => {
                setShowPassword(true);
                setType("text");
              }}
              className="absolute right-2"
            />
          ))}
      </div>
      {error && <span className="text-error text-xs">{error}</span>}
    </div>
  );
};

export default Input;
