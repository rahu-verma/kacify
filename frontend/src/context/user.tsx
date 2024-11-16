import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "../utils/api";

export type Page = "register" | "login" | "user";

const Context = createContext<{
  user?: User;
  page: Page;
  isLoading: boolean;
  setPage: Dispatch<SetStateAction<Page>>;
  setUser?: Dispatch<SetStateAction<User>>;
}>({
  user: undefined,
  page: "register",
  isLoading: false,
  setPage: () => {},
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<Page>("register");
  const [user, setUser] = useState<User>();

  return (
    <Context.Provider value={{ page, setPage, isLoading, user, setUser }}>
      {children}
    </Context.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(Context);
  return context;
};
