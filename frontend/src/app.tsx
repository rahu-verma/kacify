import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Toast from "./components/toast";
import { useNavigationContext } from "./context/navigation";
import Home from "./pages/home";
import User from "./pages/user";

const App = () => {
  const { page } = useNavigationContext();
  return (
    <div className="px-5 min-h-screen relative pt-14">
      <div className="fixed left-0 top-0 w-full px-5 border-b-[0.5px] border-primary-light">
        <Navbar />
      </div>
      <div className="h-4" />
      {page === "user" ? <User /> : <Home />}
      <div className="h-4" />
      <div className="absolute left-0 bottom-0 w-full">
        <Footer />
      </div>
      <div className="absolute top-10 right-10">
        <Toast />
      </div>
    </div>
  );
};

export default App;
