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
  emailToVerify?: string;
  setEmailToVerify?: Dispatch<SetStateAction<string>>;
}>({
  user: undefined,
  isLoading: false,
  setUser: () => {},
  emailToVerify: "",
  setEmailToVerify: () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { toastError } = useToastContext();
  const { page, setPage } = useNavigationContext();
  const [emailToVerify, setEmailToVerify] = useState<string>();

  useEffect(() => {
    if (getAuthToken() && page === "profile") {
      setIsLoading(true);
      getUserProfile().then((response) => {
        if (response.success) {
          setUser(response.data.user);
        } else {
          toastError(`failed to get user profile: ${response.message}`);
        }
        setIsLoading(false);
      });
    }
  }, [page]);

  return (
    <Context.Provider
      value={{ isLoading, user, setUser, emailToVerify, setEmailToVerify }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(Context);
  return context;
};
