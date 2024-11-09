import { createRoot } from "react-dom/client";
import Nav from "./components/nav";
import Products from "./components/products";

const App = () => {
  return (
    <>
      <Nav />
      <Products />
    </>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
