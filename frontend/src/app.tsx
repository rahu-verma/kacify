import { useNavigationContext } from "./context/navigation";
import Home from "./pages/home";
import User from "./pages/user";

export default function App() {
  const { page } = useNavigationContext();
  return page === "user" ? <User /> : <Home />;
}
