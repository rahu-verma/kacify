import { useState } from "react";
import { registerUser } from "../utils/api";
import { useNavigate } from "react-router";

const Register = ({ role }: { role: "user" | "vendor" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <h1>Register</h1>
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
        onClick={async () => {
          const response = await registerUser(email, password, role);
          if (response.message === "userCreated") {
            navigate("/login");
          } else {
            alert(response.message);
          }
        }}
      >
        submit
      </button>
    </div>
  );
};

export default Register;
