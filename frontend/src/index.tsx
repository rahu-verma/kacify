import { createRoot } from "react-dom/client";
import Nav from "./components/navbar";
import Products from "./components/products";
import "./index.css";
import Footer from "./components/footer";

const App = () => {
  return (
    <div className="px-5">
      <Nav />
      <div className="h-4" />
      <Products />
      <div className="h-4" />
      <Footer />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
