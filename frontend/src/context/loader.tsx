import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const Context = createContext<{
  showLoader: boolean;
  setShowLoader: Dispatch<SetStateAction<boolean>>;
}>({
  showLoader: false,
  setShowLoader: () => {},
});

export const LoaderProvider = ({ children }) => {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <Context.Provider
      value={{
        showLoader,
        setShowLoader,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useLoaderContext = () => {
  const context = useContext(Context);
  return context;
};
