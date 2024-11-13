import clsx from "clsx";
import { useState } from "react";
import { registerUser } from "../api/user";
import { toast } from "react-toastify";

const User = () => {
  const [error, setError] = useState<string>();
  const [page, setPage] = useState<"register" | "login" | "user">("register");
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="flex border-b-[1px] py-4 px-6">
          <h1
            className={clsx(
              "uppercase font-extrabold text-3xl cursor-pointer px-4",
              page !== "register" &&
                "text-primary-light hover:text-primary-dark"
            )}
            onClick={() => setPage("register")}
          >
            Register
          </h1>
          <h1
            className={clsx(
              "uppercase font-extrabold text-3xl cursor-pointer px-4",
              page !== "login" && "text-primary-light hover:text-primary-dark"
            )}
            onClick={() => setPage("login")}
          >
            Login
          </h1>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {page === "register" && (
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span>First Name*</span>
                <input
                  className="border-2 border-primary-light rounded-md h-10"
                  id="firstName"
                />
              </div>
              <div className="flex flex-col">
                <span>Last Name*</span>
                <input
                  className="border-2 border-primary-light rounded-md h-10"
                  id="lastName"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <span>Email*</span>
            <input
              className="border-2 border-primary-light rounded-md h-10"
              id="email"
            />
          </div>
          <div className={clsx(page === "register" && "flex gap-4")}>
            <div className="flex flex-col">
              <span>Password*</span>
              <input
                className="border-2 border-primary-light rounded-md h-10"
                id="password"
              />
            </div>
            {page === "register" && (
              <div className="flex flex-col">
                <span>Confirm Password*</span>
                <input
                  className="border-2 border-primary-light rounded-md h-10"
                  id="confirmPassword"
                />
              </div>
            )}
          </div>
        </div>
        <span
          className="bg-primary-light mt-6 text-center font-semibold tracking-wider rounded-md py-2 text-lg cursor-pointer hover:bg-primary-dark hover:text-white"
          onClick={() => {
            const inputs = Array.from(
              document.querySelectorAll("input")
            ).reduce(
              (acc, input) => {
                acc[input.id] = input.value;
                return acc;
              },
              {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }
            );
            if (page === "register") {
              if (Object.values(inputs).some((i) => !i)) {
                setError("Missing required fields");
                return;
              }
              if (!/^.+@.+\..+/.test(inputs.email)) {
                setError("Invalid email");
                return;
              }
              if (inputs.password !== inputs.confirmPassword) {
                setError("Passwords do not match");
                return;
              }
            } else {
              if (!inputs.email || !inputs.password) {
                setError("Missing required fields");
                return;
              }
            }
            setError("");
            if (page === "register") {
              registerUser(
                inputs.firstName,
                inputs.lastName,
                inputs.email,
                inputs.password
              )
                .then((user) => {
                  alert(JSON.stringify(user));
                })
                .catch(() => toast.error("unknown error"));
            }
          }}
        >
          Submit
        </span>
        {error && <span className="text-error mt-4">{error}</span>}
      </div>
    </div>
  );
};

export default User;
