import { NavigationProvider } from "./navigation";
import { ProductProvider } from "./product";

const ContextProvider = ({ children }) => {
  return (
    <NavigationProvider>
      <ProductProvider>{children}</ProductProvider>
    </NavigationProvider>
  );
};

export default ContextProvider;
