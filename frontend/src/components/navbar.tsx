import clsx from "clsx";
import { useNavigationContext } from "../context/navigation";

const Navbar = () => {
  const { page, setPage } = useNavigationContext();
  return (
    <div className="flex justify-between items-center sticky py-2">
      <div className="flex items-end cursor-pointer">
        <span className="text-4xl font-bold text-primary-light">KACIFY</span>
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
  );
};

export default Navbar;
