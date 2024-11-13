import { createRoot } from "react-dom/client";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import Layout from "./layout";

const root = createRoot(document.getElementById("root")!);

root.render(<Layout />);
