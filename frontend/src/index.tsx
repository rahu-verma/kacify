import { createRoot } from "react-dom/client";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import App from "./app";
import ContextProvider from "./context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById("root")!);

root.render(
  <ContextProvider>
    <App />
    <ToastContainer />
  </ContextProvider>
);
