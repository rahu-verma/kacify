import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Page = "home" | "user";

const Context = createContext<{
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
}>({
  page: "home",
  setPage: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [page, setPage] = useState<Page>("home");

  return (
    <Context.Provider value={{ page, setPage }}>{children}</Context.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(Context);
  return context;
};
