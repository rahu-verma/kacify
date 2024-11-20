import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserProfile, User } from "../utils/api";
import { useToastContext } from "./toast";
import { useNavigationContext } from "./navigation";
import { getAuthToken } from "../utils/authToken";

const Context = createContext<{
  user?: User;
  isLoading: boolean;
  setUser?: Dispatch<SetStateAction<User>>;
}>({
  user: undefined,
  isLoading: false,
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { toastError } = useToastContext();
  const { page, setPage } = useNavigationContext();

  useEffect(() => {
    if (getAuthToken()) {
      setIsLoading(true);
      getUserProfile()
        .then((response) => setUser(response.data.user))
        .finally(() => setIsLoading(false))
        .catch((error) => {
          if (error.message === "email_not_verified") {
            setPage("verifyEmail");
          } else {
            setPage("login");
          }
          toastError(`failed to get user profile: ${error.message}`);
        });
    }
  }, [page]);

  return (
    <Context.Provider value={{ isLoading, user, setUser }}>
      {children}
    </Context.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(Context);
  return context;
};
