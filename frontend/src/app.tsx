import Footer from "./components/footer";
import Login from "./pages/login";
import Navbar from "./components/navbar";
import Products from "./pages/products";
import Register from "./pages/register";
import Toast from "./components/toast";
import { useNavigationContext } from "./context/navigation";
import User from "./pages/profile";
import VerifyEmail from "./pages/verifyEmail";
import Loader from "./pages/loader";
import ForgotPassword from "./pages/forgotPassword";
import { useLoaderContext } from "./context/loader";
import ChangePassword from "./pages/changePassword";
import SuperuserHome from "./pages/superuserHome";

const App = () => {
  const { page } = useNavigationContext();
  const { showLoader } = useLoaderContext();
  return (
    <div className="px-5 min-h-screen relative pt-14">
      <div className="fixed left-0 top-0 w-full px-5 border-b-[0.5px] border-primary-light">
        <Navbar />
      </div>
      <div className="h-4" />
      {page === "register" && <Register />}
      {page === "products" && <Products />}
      {page === "login" && <Login />}
      {page === "profile" && <User />}
      {page === "verifyEmail" && <VerifyEmail />}
      {page === "forgotPassword" && <ForgotPassword />}
      {page === "changePassword" && <ChangePassword />}
      {page === "superuserHome" && <SuperuserHome />}
      {showLoader && (
        <div className="absolute h-screen w-full top-0 flex items-center justify-center z-50 bg-white opacity-50">
          <Loader />
        </div>
      )}
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
