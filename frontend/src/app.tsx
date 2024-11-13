import clsx from "clsx";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import ContextProvider from "./context";
import { useNavigationContext } from "./context/navigation";
import Home from "./pages/home";
import User from "./pages/user";

export default function Layout() {
  const { page, setPage } = useNavigationContext();
  return (
    <div className="px-5 min-h-screen relative pt-14">
      <div className="fixed left-0 top-0 w-full px-5 border-b-[0.5px] border-primary-light">
        <div className="flex justify-between items-center sticky py-2">
          <div className="flex items-end cursor-pointer">
            <span className="text-4xl font-bold text-primary-light">
              KACIFY
            </span>
            <span className="text-xs font-bold text-primary-light relative bottom-[4px]">
              iPhone Cases
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={clsx(
                "text-lg uppercase font-[600] tracking-wider cursor-pointer",
                page !== "home" && "text-primary-light hover:text-primary-dark"
              )}
              onClick={() => setPage("home")}
            >
              Shop
            </span>
            <span
              className={clsx(
                "text-lg uppercase font-[600] tracking-wider cursor-pointer text-primary-light"
              )}
            >
              Cart
            </span>
            <span
              className={clsx(
                "text-lg uppercase font-[600] tracking-wider cursor-pointer",
                page !== "user" && "text-primary-light hover:text-primary-dark"
              )}
              onClick={() => setPage("user")}
            >
              Account
            </span>
          </div>
        </div>
      </div>
      <div className="h-4" />
      {page === "user" ? <User /> : <Home />}
      <div className="h-4" />
      <div className="absolute left-0 bottom-0 w-full">
        <div className="border-t-[0.5px] border-primary-light p-2 items-center flex justify-between">
          <div className="flex gap-2 items-center">
            <FaFacebookF
              size={20}
              className="fill-primary-medium cursor-pointer hover:opacity-50"
            />
            <FaInstagram
              size={25}
              className="fill-primary-medium cursor-pointer hover:opacity-50"
            />
            <IoMdMail
              size={25}
              className="fill-primary-medium cursor-pointer hover:opacity-50"
              onClick={() => {
                window.location.href = `mailto:${process.env.REACT_APP_CONTACT_EMAIL}`;
              }}
            />
          </div>
          <span className="text-center text-sm">
            © {new Date().getFullYear()} KACIFY
          </span>
          <span className="cursor-pointer">Privay Policy</span>
        </div>
      </div>
    </div>
  );
}
