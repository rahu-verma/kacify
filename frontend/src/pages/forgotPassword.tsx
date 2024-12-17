import { useState } from "react";

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
          if (!email) {
            alert("Email is required");
            return;
          }
        }}
      >
        submit
      </button>
    </div>
  );
};

export default ForgotPassword;
