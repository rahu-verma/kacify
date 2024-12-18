import { useState } from "react";
import { changePassword } from "../utils/api";
import { useSearchParams } from "react-router";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div>
      <h1>Change Password</h1>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => {
          changePassword(password, searchParams.get("token") || "").then(
            (response) => {
              if (!response.success) {
                alert(response.message);
              } else {
                alert("Password changed");
              }
            }
          );
        }}
      >
        submit
      </button>
    </div>
  );
};

export default ChangePassword;
