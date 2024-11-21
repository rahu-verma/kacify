import { createRoot } from "react-dom/client";
import App from "./app";
import { NavigationProvider } from "./context/navigation";
import { ProductProvider } from "./context/product";
import { UserProvider } from "./context/user";
import "./index.css";
import { ToastProvider } from "./context/toast";
import { LoaderProvider } from "./context/loader";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ToastProvider>
    <LoaderProvider>
      <NavigationProvider>
        <ProductProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ProductProvider>
      </NavigationProvider>
    </LoaderProvider>
  </ToastProvider>
);
