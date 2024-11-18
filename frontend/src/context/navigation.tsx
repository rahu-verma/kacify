import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Page = "products" | "user" | 'register' | 'login' | 'verifyEmail';

const Context = createContext<{
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
}>({
  page: "products",
  setPage: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [page, setPage] = useState<Page>("verifyEmail");

  return (
    <Context.Provider value={{ page, setPage }}>{children}</Context.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(Context);
  return context;
};
