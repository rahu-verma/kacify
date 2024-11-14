import { TextButton } from "../components/buttons";
import Register from "../components/register";
import { useUserContext } from "../context/user";

const User = () => {
  const { page, setPage } = useUserContext();
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center">
        <div className="flex border-b-[1px] py-4 px-6 gap-10">
          <TextButton
            className={`${page === "register" ? "[&&]:text-primary-dark" : ""}`}
            onClick={() => setPage("register")}
            text="Register"
          />
          <TextButton
            text="Login"
            className={`${page === "login" ? "[&&]:text-primary-dark" : ""}`}
            onClick={() => setPage("login")}
          />
        </div>
        {page === "register" && <Register />}
      </div>
    </div>
  );
};

export default User;
