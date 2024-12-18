import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Products from "./pages/products";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Logout from "./pages/logout";
import ForgotPassword from "./pages/forgotPassword";
import AdminLogin from "./pages/adminLogin";
import Users from "./pages/users";
import ChangePassword from "./pages/changePassword";

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/changePassword" element={<ChangePassword />} />
    </Routes>
  </BrowserRouter>
);
