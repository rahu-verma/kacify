import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./user";

type Page =
  | "products"
  | "profile"
  | "register"
  | "login"
  | "verifyEmail"
  | "forgotPassword"
  | "changePassword"
  | "superuserHome";

const Context = createContext<{
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
}>({
  page: "products",
  setPage: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [page, setPage] = useState<Page>("products");
  const { user, setEmailToVerify } = useUserContext();

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === "/superuser" && user?.role === "superuser") {
      setPage("superuserHome");
    }
    if (user && !user.emailVerified) {
      setPage("verifyEmail");
      setEmailToVerify(user.email);
    }
  }, [user]);

  return (
    <Context.Provider value={{ page, setPage }}>{children}</Context.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(Context);
  return context;
};
