import { useState } from "react";
import { loginAdmin, loginUser } from "../utils/api";
import { storeAuthToken } from "../utils/localStorage";
import { useNavigate } from "react-router";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <h1>Admin Login</h1>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => {
          if (!email || !password) {
            alert("Email and password are required");
            return;
          }
          loginAdmin(email, password).then((response) => {
            if (response.success) {
              storeAuthToken(response.data);
              navigate("/profile");
            } else {
              alert(response.message);
            }
          });
        }}
      >
        submit
      </button>
    </div>
  );
};

export default AdminLogin;
