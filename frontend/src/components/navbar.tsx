import { useNavigationContext } from "../context/navigation";
import { useUserContext } from "../context/user";
import { getAccountPage } from "../utils/authToken";
import { TextButton } from "./buttons";

const Navbar = () => {
  const { page, setPage } = useNavigationContext();
  const { user } = useUserContext();
  return (
    <div className="flex justify-between items-center sticky py-2">
      <div className="flex items-end">
        <span className="text-4xl font-bold text-primary-light">KACIFY</span>
      </div>
      <div className="flex items-center gap-4">
        {user?.role === "superuser" ? (
          <TextButton
            text="Home"
            onClick={() => setPage("superuserHome")}
            className={page === "superuserHome" && "[&&]:text-primary-dark"}
          />
        ) : (
          <>
            <TextButton
              text="Shop"
              onClick={() => setPage("products")}
              className={page === "products" && "[&&]:text-primary-dark"}
            />
            <TextButton text="Cart" />
          </>
        )}
        <TextButton
          text="Account"
          onClick={() => setPage(getAccountPage())}
          className={page === getAccountPage() && "[&&]:text-primary-dark"}
        />
      </div>
    </div>
  );
};

export default Navbar;
