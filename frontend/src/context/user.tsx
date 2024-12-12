import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserProfile, User } from "../utils/api";
import { getAuthToken } from "../utils/authToken";
import { useToastContext } from "./toast";
import { useNavigationContext } from "./navigation";

const Context = createContext<{
  user?: User;
  isLoading: boolean;
  setUser?: Dispatch<SetStateAction<User>>;
  emailToVerify?: string;
  setEmailToVerify?: Dispatch<SetStateAction<string>>;
  refreshUser?: () => void;
}>({
  user: undefined,
  isLoading: false,
  setUser: () => {},
  emailToVerify: "",
  setEmailToVerify: () => {},
  refreshUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { toastError } = useToastContext();
  const [emailToVerify, setEmailToVerify] = useState<string>();
  const { setPage, page } = useNavigationContext();

  const refreshUser = useCallback(() => {
    if (!getAuthToken()) return;
    setIsLoading(true);
    getUserProfile().then((response) => {
      if (response.data?.user) setUser(response.data.user);

      if (!response.success) {
        toastError(`failed to get user profile: ${response.message}`);
      }

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        isLoading,
        user,
        setUser,
        emailToVerify,
        setEmailToVerify,
        refreshUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(Context);
  return context;
};
