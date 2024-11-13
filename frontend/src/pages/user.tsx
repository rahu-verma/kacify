import clsx from "clsx";
import { useState } from "react";

const User = () => {
  const [page, setPage] = useState<"register" | "login" | "user">("register");
  return (
    <div className="flex justify-center">
      <div className="flex border-b-[1px] py-4 px-6">
        <h1
          className={clsx(
            "uppercase font-extrabold text-3xl cursor-pointer px-4",
            page !== "register" && "text-primary-light hover:text-primary-dark"
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
    </div>
  );
};

export default User;
