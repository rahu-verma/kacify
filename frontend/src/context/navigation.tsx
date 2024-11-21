import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Page =
  | "products"
  | "profile"
  | "register"
  | "login"
  | "verifyEmail"
  | "forgotPassword"
  | "changePassword";

const Context = createContext<{
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
}>({
  page: "products",
  setPage: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [page, setPage] = useState<Page>("products");

  return (
    <Context.Provider value={{ page, setPage }}>{children}</Context.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(Context);
  return context;
};
