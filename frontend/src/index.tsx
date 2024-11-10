import { createRoot } from "react-dom/client";
import Nav from "./components/nav";
import Products from "./components/products";

const App = () => {
  return (
    <>
      <Nav />
      <div style={{ height: 20 }} />
      <Products />
    </>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
