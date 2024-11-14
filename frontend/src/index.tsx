import { createRoot } from "react-dom/client";
import App from "./app";
import { NavigationProvider } from "./context/navigation";
import { ProductProvider } from "./context/product";
import { UserProvider } from "./context/user";
import "./index.css";
import { ToastProvider } from "./context/toast";

const root = createRoot(document.getElementById("root")!);

root.render(
  <NavigationProvider>
    <ProductProvider>
      <UserProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </UserProvider>
    </ProductProvider>
  </NavigationProvider>
);
