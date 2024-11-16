import { useNavigationContext } from "../context/navigation";
import { getAccountPage } from "../utils/common";
import { TextButton } from "./buttons";

const Navbar = () => {
  const { page, setPage } = useNavigationContext();
  return (
    <div className="flex justify-between items-center sticky py-2">
      <div
        className="flex items-end cursor-pointer"
        onClick={() => setPage("products")}
      >
        <span className="text-4xl font-bold text-primary-light">KACIFY</span>
        <span className="text-xs font-bold text-primary-light relative bottom-[4px]">
          iPhone Cases
        </span>
      </div>
      <div className="flex items-center gap-4">
        <TextButton
          text="Shop"
          onClick={() => setPage("products")}
          className={page === "products" && "[&&]:text-primary-dark"}
        />
        <TextButton text="Cart" />
        <TextButton
          text="Account"
          onClick={() => setPage(getAccountPage())}
          className={page === "user" && "[&&]:text-primary-dark"}
        />
      </div>
    </div>
  );
};

export default Navbar;
