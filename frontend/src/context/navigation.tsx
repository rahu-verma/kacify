import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Page = "home" | "user";

type NavigationContextType = {
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
};

const NavigationContext = createContext<NavigationContextType>({
  page: "home",
  setPage: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [page, setPage] = useState<Page>("home");

  return (
    <NavigationContext.Provider value={{ page, setPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  return context;
};
