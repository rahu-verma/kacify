import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "../utils/api";

type Page = "register" | "login" | "user";

const Context = createContext<{
  user?: User;
  page: Page;
  isLoading: boolean;
  setPage: Dispatch<SetStateAction<Page>>;
}>({
  user: undefined,
  page: "register",
  isLoading: true,
  setPage: () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<Page>("register");
  const [user, setUser] = useState<User>();

  return (
    <Context.Provider value={{ page, setPage, isLoading, user }}>
      {children}
    </Context.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(Context);
  return context;
};
