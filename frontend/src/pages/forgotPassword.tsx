import { useState } from "react";
import { forgotPassword } from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  return (
    <div>
      <h1>Forgot Password</h1>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={() => {
          forgotPassword(email).then((response) => {
            if (!response.success) {
              alert(response.message);
            } else {
              alert("Password reset email sent");
            }
          });
        }}
      >
        submit
      </button>
    </div>
  );
};

export default ForgotPassword;
