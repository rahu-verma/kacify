import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ToastType = "success" | "error";

const Context = createContext<{
  toastMessage: string;
  showToast: boolean;
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  toastType: ToastType;
  setShowToast: (show: boolean) => void;
}>({
  toastMessage: "",
  showToast: false,
  toastSuccess: () => {},
  toastError: () => {},
  toastType: "success",
  setShowToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (showToast) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setShowToast(false);
        }, 3000)
      );
    }
  }, [toastMessage]);

  const toastSuccess = useCallback((message: string) => {
    setToastType("success");
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const toastError = useCallback((message: string) => {
    setToastType("error");
    setToastMessage(message);
    setShowToast(true);
  }, []);

  return (
    <Context.Provider
      value={{
        showToast,
        toastMessage,
        toastSuccess,
        toastError,
        toastType,
        setShowToast,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(Context);
  return context;
};
